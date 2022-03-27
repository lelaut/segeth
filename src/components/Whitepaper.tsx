import "../pages/solidity.css";

import React from "react";

import Code from "./Code";

interface Props {
  select: number;
  className?: string;
}

const sections = [
  <>
    <h1 className="text-4xl font-bold">Re-entrancy</h1>
    <p>
      Voluptate magna cillum ex occaecat adipisicing velit est irure do eiusmod
      elit. Irure sunt consectetur incididunt culpa qui voluptate. Adipisicing
      nisi nostrud consequat nisi voluptate labore officia elit esse incididunt.
      Culpa ex Lorem amet officia laboris sit non non velit ullamco exercitation
      sunt. Exercitation voluptate eiusmod eiusmod voluptate ut aliqua dolore
      cupidatat officia excepteur. Do excepteur aliquip in labore ut amet qui
      enim. Proident incididunt magna adipisicing do.
      <br />
      <br />
      Sint nisi non occaecat incididunt anim sunt reprehenderit pariatur
      deserunt qui Lorem elit. Non proident enim aliqua dolor in tempor
      cupidatat cupidatat aliqua ipsum anim consectetur esse eiusmod. Deserunt
      ullamco enim irure mollit proident in deserunt quis id. Consectetur quis
      veniam adipisicing ex cillum excepteur commodo dolore culpa amet ullamco
      dolor. Officia dolor eiusmod commodo tempor adipisicing officia ad sunt
      nostrud Lorem consectetur ex in ea.
    </p>
    <Code
      value={`// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract HelloWorld {
    function helloWorld() external pure returns (string memory) {
        return "Hello, World!";
    }
}`}
    />
  </>,
];

const Whitepaper = ({ select, className }: Props) => {
  if (select >= 0) {
    return (
      <section
        className={
          "pt-[100px] md:pt-8 px-4 md:px-12 py-8" +
          (className ? ` ${className}` : "")
        }
      >
        <div className="flex flex-col gap-4">{sections[select]}</div>
      </section>
    );
  }

  return (
    <section
      className={
        "pt-[100px] md:pt-8 px-4 md:px-12 py-8" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="flex flex-col gap-8">
        {sections.map((item, index) => (
          <div key={index} className="flex flex-col gap-4">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Whitepaper;
