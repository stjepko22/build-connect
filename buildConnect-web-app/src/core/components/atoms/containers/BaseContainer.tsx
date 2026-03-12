import React from 'react';
import { Container, ContainerProps, Box, Fade } from '@mui/material';

interface BaseContainerProps extends ContainerProps {
  withPadding?: boolean;
  animate?: boolean;
}

const BaseContainer: React.FC<BaseContainerProps> = ({ 
  children, 
  withPadding = true, 
  animate = true, 
  ...props 
}) => {
  const content = (
    <Container {...props}>
      <Box sx={{ py: withPadding ? { xs: 3, md: 6 } : 0 }}>
        {children}
      </Box>
    </Container>
  );

  if (animate) {
    return (
      <Fade in={true} timeout={500}>
        <Box>{content}</Box>
      </Fade>
    );
  }

  return content;
};

export default BaseContainer;

