import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const Loading = (props) => (
  <Container className="text-center mx-auto p-2">
    <h5>{props.title}</h5>
    <Spinner animation="border" variant="primary" className="mx-auto">
    </Spinner>
  </Container>
);

export default Loading;
