import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "./Loading";
import { isAddress } from "../lib/eth";
import { sendAnalysisByAddress, sendAnalysisByCode } from "../lib/action";

interface Props {
  hide: boolean;
  setHide: (v: boolean) => void;
}

const AnalysisFormModel = ({ hide, setHide }: Props) => {
  const navigate = useNavigate();
  const inputFile = useRef(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [address, setAddress] = useState("");
  const [contractFile, setContractFile] = useState<File>();
  const tabItems = [
    {
      title: "By address",
      component: (
        <input
          name="address"
          type="text"
          placeholder="0xae2df9f730c54400934c06a17462c41c08a06ed8"
          className="w-full bg-white bg-opacity-5 pl-2"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setAddress(event.target.value)
          }
          value={address}
        />
      ),
    },
    {
      title: "By code",
      component: (
        <div className="w-full flex">
          {contractFile?.name ? (
            <button
              className="px-2 bg-[#0a0a0a] text-red-600 transition hover:bg-transparent"
              onClick={() => setContractFile(undefined)}
            >
              Remove
            </button>
          ) : (
            <button
              className="px-2 bg-[#0a0a0a] transition hover:bg-white hover:text-[#0a0a0a]"
              onClick={() => (inputFile.current! as any).click()}
            >
              Upload
            </button>
          )}
          <input
            ref={inputFile}
            accept=".sol"
            type="file"
            name="name"
            style={{ display: "none" }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const contract = event.target.files?.item(0);

              if (contract) {
                setContractFile(contract);
              }
            }}
          />
          <div className="flex-1 w-full bg-white bg-opacity-5 pl-2 text-[#aaa]">
            {contractFile?.name ?? "contract.sol"}
          </div>
        </div>
      ),
    },
  ];
  const canRun =
    (tab === 0 && isAddress(address)) || (tab === 1 && contractFile?.name);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setHide(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setHide]);

  const handleRun = async () => {
    setLoading(true);

    try {
      // By address
      if (tab === 0) {
        navigate("/analyze/" + (await sendAnalysisByAddress(address)));
      }
      // By code
      else {
        navigate("/analyze/" + (await sendAnalysisByCode(contractFile!)));
      }
    } catch (error: any) {
      console.log({ error });
      setError("Unable to compile or find this contract");
    }

    setLoading(false);
  };

  return (
    <div
      className={
        "fixed z-10 inset-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center text-white text-sm " +
        (hide ? "hidden" : "")
      }
    >
      <div
        ref={modalRef}
        className="max-w-prose m-4 p-4 bg-secondary border border-[#222] rounded-sm"
      >
        <div className="flex items-center justify-between">
          <h2>Analysis</h2>
          <button
            className="bg-red-500 w-[12px] h-[12px] rounded-full transition hover:opacity-70"
            onClick={() => setHide(true)}
          />
        </div>
        <p className="opacity-70 py-2">
          Est non proident enim id labore dolor labore eu enim officia id
          commodo nostrud reprehenderit.
        </p>
        <ul className="flex gap-2">
          {tabItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setTab(index)}
              className={
                "cursor-pointer" + (index === tab ? " text-blue-500" : "")
              }
            >
              {item.title}
            </li>
          ))}
        </ul>
        <div className="py-3">{tabItems[tab].component}</div>
        <div className="flex justify-between">
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleRun}
            disabled={!canRun}
            className={
              "flex items-center px-4 py-px rounded-sm " +
              (canRun
                ? "bg-blue-600 transition hover:opacity-70"
                : "bg-gray-500")
            }
          >
            <Loading hide={!loading} className="h-3 w-3" />
            <p>{loading ? "Running..." : "Run"}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisFormModel;
