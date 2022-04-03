import "./Whitepaper.css";

import React from "react";

import Code from "./Code";

interface Props {
  select: string;
  className?: string;
}

const vulnerabilityToIndex: Record<string, number> = {
  "All vulnerabilities": 0,
  "reentrancy-eth": 1,
  "reentrancy-no-eth": 2,
  "reentrancy-benign": 3,
  "reentrancy-events": 4,
  "reentrancy-unlimited-gas": 5,
};

const sectionGroups = [
  {
    sections: [0, 1, 2, 3, 4],
    component: (
      <>
        <h1 className="text-4xl font-bold">Reentrancy vulnerabilities</h1>
        <p>
          A state variable is changed after a contract uses{" "}
          <mark>call.value</mark>. The attacker uses a fallback function which
          is automatically executed after Ether is transferred from the targeted
          contract—to execute the vulnerable function again, before the state
          variable is changed.
        </p>

        <h3>Mitigations</h3>
        <ul className="list-disc">
          <li>
            Avoid use of <mark>call.value</mark>
          </li>
        </ul>

        <h3>Real examples</h3>
        <ul className="list-disc">
          <li>
            The{" "}
            <a
              href="https://hackingdistributed.com/2016/06/18/analysis-of-the-dao-exploit/"
              target="_blank"
              rel="noreferrer"
            >
              DAO
            </a>{" "}
            hack
          </li>
          <li>
            The{" "}
            <a
              href="https://medium.com/spankchain/we-got-spanked-what-we-know-so-far-d5ed3a0f38fe"
              target="_blank"
              rel="noreferrer"
            >
              SpankChain
            </a>{" "}
            hack
          </li>
        </ul>
      </>
    ),
  },
];

const sections = [
  <>
    <h2>Reentrancy with eth</h2>
    <p>A reentrancy bug where it does involve Ether.</p>
    <Code
      value={`    function withdrawBalance(){
        // send userBalance[msg.sender] Ether to msg.sender
        // if mgs.sender is a contract, it will call its fallback function
        if( ! (msg.sender.call.value(userBalance[msg.sender])() ) ){
            throw;
        }
        userBalance[msg.sender] = 0;
    }`}
    />
    <p>
      Bob uses the re-entrancy bug to call <mark>withdrawBalance</mark> two
      times, and withdraw more than its initial deposit to the contract.
    </p>
  </>,
  <>
    <h2>Reentrancy without eth</h2>
    <p>
      A reentrancy bug where it does <b>NOT</b> involve Ether.
    </p>
    <Code
      value={`    function bug(){
        require(not_called);
        if( ! (msg.sender.call() ) ){
            throw;
        }
        not_called = False;
    }`}
    />
  </>,
  <>
    <h2>Reentrancy benign</h2>
    <p>A reentrancy bug that acts as a double call.</p>
    <Code
      value={`    function callme(){
        if( ! (msg.sender.call()() ) ){
            throw;
        }
        counter += 1
    }`}
    />
    <p>
      <mark>callme</mark> contains a reentrancy. The reentrancy is benign
      because it's exploitation would have the same effect as two consecutive
      calls.
    </p>
  </>,
  <>
    <h2>Reentrancy events</h2>
    <p>A reentrancy bug that is leading to out-of-order events.</p>
    <Code
      value={`    function bug(Called d){
      counter += 1;
      d.f();
      emit Counter(counter);
  }`}
    />
    <p>
      If <mark>d.()</mark> re-enters, the <mark>Counter</mark> events will be
      shown in an incorrect order, which might lead to issues for third parties.
    </p>
  </>,
  <>
    <h2>Reentrancy unlimited gas</h2>
    <p>
      A reentrancy bug that is based on <mark>transfer</mark> or{" "}
      <mark>send</mark>.
    </p>
    <Code
      value={`    function callme(){
        msg.sender.transfer(balances[msg.sender]):
        balances[msg.sender] = 0;
    }`}
    />
    <p>
      <mark>send</mark> and <mark>transfer</mark> do not protect from
      reentrancies in case of gas price changes.
    </p>
  </>,
];

const Whitepaper = ({ select, className }: Props) => {
  const vulIndex = vulnerabilityToIndex[select];

  console.log(vulIndex);

  if (vulIndex > 0) {
    return (
      <section
        className={
          "whitepaper pt-[100px] md:pt-8 px-4 md:px-12 py-8" +
          (className ? ` ${className}` : "")
        }
      >
        {sectionGroups
          .filter((s) => s.sections.includes(vulIndex - 1))
          .map((item, index) => (
            <div key={index} className="flex flex-col gap-4">
              {item.component}
            </div>
          ))}
        <div className="flex flex-col gap-4">{sections[vulIndex - 1]}</div>
      </section>
    );
  }

  return (
    <section
      className={
        "whitepaper pt-[100px] md:pt-8 px-4 md:px-12 py-8" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="flex flex-col gap-8">
        {sections
          .flatMap((s, i) => {
            const group = sectionGroups.filter((g) => g.sections[0] === i);
            return group.length > 0 ? [group[0].component, s] : s;
          })
          .map((item, index) => {
            console.log(item);
            return (
              <div key={index} className="flex flex-col gap-4">
                {item}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Whitepaper;
