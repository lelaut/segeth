import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";

import AnalysisFormModel from "../components/AnalysisFormModel";
import Loading from "../components/Loading";
import Logo from "../components/Logo";
import Whitepaper from "../components/Whitepaper";
import { getAnalysis, Analysis } from "../lib/action";
import { isAddress } from "../lib/eth";

interface VulnerabilityTooltip {
  x: number;
  y: number;
}

// const vulnerabilityOptions = [
//   { value: 0, label: "All vulnerabilities" },
//   { value: 1, label: "Reentrancy without eth" },
//   { value: 2, label: "Reentrancy with eth" },
// ];

// TODO: make a special page for when the contract don't have any vulnerability
const AnalyzePage = () => {
  const [hideModal, setHideModal] = useState(true);
  const [vulnerability, setVulnerability] = useState("All vulnerabilities");
  const [tooltip, setTooltip] = useState<VulnerabilityTooltip>();
  const [toolSelected, setToolSelected] = useState(-1);
  const [hideNav, setHideNav] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | undefined>();
  const params = useParams();
  // const results = [
  //   { vulnerability: [1, 0], time: 100, name: "Slither" },
  //   { vulnerability: [-1, 1], time: 1000, name: "Olient" },
  // ];
  const totalVunerabilities = Array.from(
    new Set(analysis?.results.flatMap((r) => r.vulnerabilities))
  );
  const hasAnalysis = typeof analysis !== "undefined";

  const handleEnterResultValue = (e: React.MouseEvent<HTMLDivElement>) => {
    setTooltip({
      x: (e.target as any).offsetLeft + 1,
      y: (e.target as any).offsetTop - 1,
    });
  };
  const handleLeaveResultValue = () => {
    setTooltip(undefined);
  };

  useEffect(() => {
    const handleLoad = async () => {
      setAnalysis(await getAnalysis(params.target!));
    };

    handleLoad();
  }, [params]);

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
            {isAddress(params.target!) ? (
              <div className="px-2">
                <h2 className="mb-1 text-sm opacity-80">Target</h2>
                <a
                  href={`https://etherscan.io/address/${params.target}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden text-ellipsis text-blue-500 max-w-full transition hover:text-blue-400"
                >
                  {params.target}
                </a>
              </div>
            ) : (
              <></>
            )}

            {!hasAnalysis ? (
              <></>
            ) : (
              <>
                <div className="px-2">
                  <h2 className="mb-1 text-sm opacity-80">Vulnerability</h2>
                  <Select
                    // defaultValue={vulnerabilityOptions[vulnerability]}
                    defaultValue={{
                      value: vulnerability,
                      label: vulnerability,
                    }}
                    onChange={(selected: any) =>
                      setVulnerability(selected.value)
                    }
                    options={["All vulnerabilities"]
                      .concat(totalVunerabilities)
                      .map((item) => ({ value: item, label: item }))}
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
                    {!hasAnalysis ? (
                      <></>
                    ) : vulnerability === "All vulnerabilities" ? (
                      analysis.results.map((item, index) => (
                        <li key={index}>
                          <div className="px-4 py-2 bg-secondary flex items-center justify-between">
                            <div>
                              <div className="flex gap-1">
                                <h2>{item.name}</h2>
                              </div>
                              <p className="text-xs opacity-50">
                                {item.time} ns
                              </p>
                            </div>
                            <button
                              className={
                                `text-xs bg-white bg-opacity-5 rounded-full px-3 border border-white/5 font-bold hover:after:content-['${
                                  toolSelected !== index ? "▾" : ""
                                }']` +
                                (item.vulnerabilities.length === 0
                                  ? " bg-green-700 bg-opacity-100 cursor-default"
                                  : "")
                              }
                              onClick={() =>
                                setToolSelected(
                                  toolSelected === index ? -1 : index
                                )
                              }
                            >
                              {item.vulnerabilities.length === 0
                                ? "Safe"
                                : `${item.vulnerabilities.length} / ${
                                    totalVunerabilities.length
                                  } ${toolSelected === index ? "▴" : ""}`}
                            </button>
                          </div>
                          <ul
                            className={
                              "bg-[#0c1016] text-sm flex flex-col gap-px" +
                              (toolSelected !== index ? " hidden" : "")
                            }
                          >
                            {item.vulnerabilities.map((subItem, jndex) => (
                              <li
                                key={jndex}
                                className="px-4 py-1 bg-[#10151d] flex justify-between items-center"
                              >
                                <p>{subItem}</p>
                                <div className="w-[8px] h-[8px] rounded-full bg-red-500" />
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))
                    ) : (
                      analysis.results.map((item, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 bg-secondary flex items-center justify-between"
                        >
                          <div>
                            <div className="flex gap-1">
                              <h2>{item.name}</h2>
                            </div>
                            <p className="text-xs opacity-50">{item.time} ns</p>
                          </div>
                          <div
                            className="w-[14px] h-[14px] z-20 rounded-full bg-red-500"
                            onMouseEnter={(e) => handleEnterResultValue(e)}
                            onMouseLeave={(e) => handleLeaveResultValue()}
                          />
                        </li>
                      ))
                    )}
                  </ul>

                  {tooltip ? (
                    <p
                      className="absolute font-bold text-xs pl-5 pr-3 rounded-full bg-red-600"
                      style={{ left: tooltip.x, top: tooltip.y }}
                    >
                      Vulnerable
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )}
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

      {hasAnalysis ? (
        <Whitepaper select={vulnerability} className="md:ml-[300px]" />
      ) : (
        <div className="md:ml-[300px] flex h-screen items-center justify-center">
          <Loading hide={false} className="w-16 md:w-24 h-16 md:h-24" />
        </div>
      )}

      <AnalysisFormModel hide={hideModal} setHide={setHideModal} />
    </>
  );
};

export default AnalyzePage;
