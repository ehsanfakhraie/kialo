import React from 'react';
import {Card} from 'reactstrap';

const ContainerText = ({title}) => {
  return (
    <Card className="shadow border-15">
      <h3 className='align-self-start'><b>{title}</b></h3>
    </Card>
  )
};

export default ContainerText;

