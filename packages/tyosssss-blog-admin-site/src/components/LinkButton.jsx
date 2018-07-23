import React from "react";
import { Button } from "antd";

const LinkButton = props => {
  return <Button {...props}>{props.children}</Button>;
};

export default LinkButton;
