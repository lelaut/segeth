import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";

import AnalysisFormModel from "../components/AnalysisFormModel";
import Logo from "../components/Logo";
import Whitepaper from "../components/Whitepaper";
import { isAddress } from "../lib/eth";

interface VulnerabilityTooltip {
  x: number;
  y: number;
  tip: number;
}

const vulnerabilityOptions = [
  { value: 0, label: "All vulnerabilities" },
  { value: 1, label: "Reentrancy without eth" },
  { value: 2, label: "Reentrancy with eth" },
];

const AnalyzePage = () => {
  const [hideModal, setHideModal] = useState(true);
  const [vulnerability, setVulnerability] = useState(0);
  const [tooltip, setTooltip] = useState<VulnerabilityTooltip>();
  const [toolSelected, setToolSelected] = useState(-1);
  const [hideNav, setHideNav] = useState(true);
  const params = useParams();
  const results = [
    { vulnerability: [1, 0], time: 100, name: "Slither" },
    { vulnerability: [-1, 1], time: 1000, name: "Olient" },
  ];

  const handleEnterResultValue = (
    e: React.MouseEvent<HTMLDivElement>,
    vulnerability: number
  ) => {
    setTooltip({
      tip: vulnerability,
      x: (e.target as any).offsetLeft + 1,
      y: (e.target as any).offsetTop - 1,
    });
    console.log(vulnerability);
  };
  const handleLeaveResultValue = () => {
    setTooltip(undefined);
  };

  return (
    <>
      <nav className="z-[1000] bg-[#080b0f] md:hidden fixed bg-secondary w-screen flex items-center justify-between px-8 py-4">
        <Logo className="relative !m-0" />
        <button onClick={() => setHideNav(!hideNav)}>
          {hideNav ? "▼" : "▲"}
        </button>
      </nav>

      <aside
        className={
          (hideNav ? "hidden " : " ") +
          "md:flex pt-[74px] md:pt-0 fixed flex-col w-full md:min-w-[300px] md:max-w-[300px] h-screen bg-secondary 50 text-[#ccc] border-r border-white/5"
        }
      >
        <Logo className="hidden relative md:flex justify-center m-4 md:m-8" />

        <div className="flex flex-col flex-1">
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="px-2">
              <h2 className="mb-1 text-sm opacity-80">Target</h2>
              {isAddress(params.target!) ? (
                <a
                  href={`https://etherscan.io/address/${params.target}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden text-ellipsis text-blue-500 max-w-full transition hover:text-blue-400"
                >
                  {params.target}
                </a>
              ) : (
                <p>{params.target}</p>
              )}
            </div>

            <div className="px-2">
              <h2 className="mb-1 text-sm opacity-80">Vulnerability</h2>
              <Select
                defaultValue={vulnerabilityOptions[vulnerability]}
                onChange={(selected: any) => setVulnerability(selected.value)}
                options={vulnerabilityOptions as any}
                isSearchable={false}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 100,
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  spacing: {
                    ...theme.spacing,
                    controlHeight: 0,
                    baseUnit: 2,
                  },
                  borderRadius: 1,
                  colors: {
                    ...theme.colors,
                    primary25: "#2c333d",
                    neutral0: "#191d23",
                    neutral20: "#ffffff33",
                    neutral80: "#ffffff77",
                  },
                })}
              />
            </div>

            <div>
              <h2 className="pl-2 mb-1 text-sm opacity-80">Results</h2>
              <ul className="bg-white bg-opacity-5 py-px gap-px flex flex-col">
                {vulnerability === 0
                  ? results.map((item, index) => (
                      <li key={index}>
                        <div className="px-4 py-2 bg-secondary flex items-center justify-between">
                          <div>
                            <div className="flex gap-1">
                              <h2>{item.name}</h2>
                            </div>
                            <p className="text-xs opacity-50">{item.time}ms</p>
                          </div>
                          <button
                            className={`text-xs bg-white bg-opacity-5 rounded-full px-3 border border-white/5 font-bold hover:after:content-['${
                              toolSelected !== index ? "▾" : ""
                            }']`}
                            onClick={() =>
                              setToolSelected(
                                toolSelected === index ? -1 : index
                              )
                            }
                          >
                            {`${
                              item.vulnerability.filter((v) => v === 1).length
                            } / ${
                              item.vulnerability.filter((v) => v !== -1).length
                            } ${toolSelected === index ? "▴" : ""}`}
                          </button>
                        </div>
                        <ul
                          className={
                            "bg-[#0c1016] text-sm flex flex-col gap-px" +
                            (toolSelected !== index ? " hidden" : "")
                          }
                        >
                          {item.vulnerability
                            .filter((v) => v !== -1)
                            .map((subItem, jndex) => (
                              <li
                                key={jndex}
                                className="px-4 py-1 bg-[#10151d] flex justify-between items-center"
                              >
                                <p>{vulnerabilityOptions[jndex + 1].label}</p>
                                <div
                                  className={
                                    "w-[8px] h-[8px] rounded-full" +
                                    (subItem === 0
                                      ? " bg-green-500"
                                      : " bg-red-500")
                                  }
                                />
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))
                  : results.map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 bg-secondary flex items-center justify-between"
                      >
                        <div>
                          <div className="flex gap-1">
                            <h2>{item.name}</h2>
                          </div>
                          <p className="text-xs opacity-50">{item.time}ms</p>
                        </div>
                        <div
                          className={
                            "w-[14px] h-[14px] z-20 rounded-full" +
                            (item.vulnerability[vulnerability - 1] === 0
                              ? " bg-green-500"
                              : item.vulnerability[vulnerability - 1] === 1
                              ? " bg-red-500"
                              : " bg-gray-500")
                          }
                          onMouseEnter={(e) =>
                            handleEnterResultValue(
                              e,
                              item.vulnerability[vulnerability - 1] + 1
                            )
                          }
                          onMouseLeave={(e) => handleLeaveResultValue()}
                        />
                      </li>
                    ))}
              </ul>

              {tooltip ? (
                <p
                  className={
                    "absolute font-bold text-xs pl-5 pr-3 rounded-full" +
                    [" bg-gray-600", " bg-green-600", " bg-red-600"][
                      tooltip.tip
                    ]
                  }
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  {["Unavailable", "Secure", "Vulnerable"][tooltip.tip]}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex p-4">
            <button
              className="w-full py-px rounded-sm bg-blue-600 transition hover:bg-blue-500"
              onClick={() => setHideModal(false)}
            >
              Analyze
            </button>
          </div>
        </div>
      </aside>

      <Whitepaper select={vulnerability - 1} className="md:ml-[300px]" />

      <AnalysisFormModel hide={hideModal} setHide={setHideModal} />
    </>
  );
};

export default AnalyzePage;
