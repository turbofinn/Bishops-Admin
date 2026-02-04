import PropTypes from 'prop-types';

// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: '80px',
        width: 'initial',
        marginTop: open ? '20px' : '16px',
        paddingBottom: open ? '24px' : '16px',
        paddingLeft: open ? '24px' : '12px',
        paddingRight: open ? '24px' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center'
      }}
    >
      <Logo
        isIcon={!open}
        sx={{
          width: open ? 140 : 40,
          height: open ? 35 : 40,
          transition: 'all 0.3s ease-in-out',
          objectFit: 'contain'
        }}
      />
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
