#!/bin/bash

# === CONFIGURATION ===
BUCKET_NAME="bishops-admin"       # <-- Change as needed
REGION="eu-west-2"               # <-- Change to your AWS region
BUILD_DIR="dist"
PROFILE="bishops"                # AWS CLI profile (or omit if using default config)

# === SCRIPT START ===

# Ensure the script itself has execute permission (optional here)
chmod +x "$0"

echo "🔍 Checking if bucket exists..."
if aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" --profile "$PROFILE" 2>/dev/null; then
    echo "✅ Bucket exists: $BUCKET_NAME"
else
    echo "🪣 Bucket does not exist. Creating: $BUCKET_NAME"
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION" \
        --profile "$PROFILE"
fi

echo "🌐 Enabling static website hosting..."
aws s3 website s3://$BUCKET_NAME/ \
  --index-document index.html \
  --error-document index.html \
  --profile "$PROFILE"

echo "🧱 Building project..."
npm run build || { echo "❌ Build failed"; exit 1; }

echo "🚀 Deploying files to S3..."
aws s3 sync $BUILD_DIR/ s3://$BUCKET_NAME \
  --region $REGION \
  --delete \
  --profile "$PROFILE" || { echo "❌ Sync failed"; exit 1; }

echo "🔐 Applying public-read bucket policy..."
aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Sid\": \"PublicReadGetObject\",
        \"Effect\": \"Allow\",
        \"Principal\": \"*\",
        \"Action\": \"s3:GetObject\",
        \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
      }
    ]
  }" \
  --region $REGION \
  --profile "$PROFILE"

WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Deployed successfully!"
echo "🌐 Live URL: $WEBSITE_URL"
