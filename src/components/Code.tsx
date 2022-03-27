import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { irBlack } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Props {
  value: string;
}

const Code = ({ value }: Props) => {
  return (
    <SyntaxHighlighter language="solidity" style={irBlack}>
      {value}
    </SyntaxHighlighter>
  );
};

export default Code;
