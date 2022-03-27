import React, { useState } from "react";
import AnalysisFormModel from "../components/AnalysisFormModel";

import Logo from "../components/Logo";

import platformImage from "../assets/platform.jpg";
import BlobBackground from "../components/BlobBackground";

const HomePage = () => {
  const [hideModel, setHideModel] = useState(true);

  return (
    <>
      <Logo className="z-10" />

      <div className="absolute flex pt-16 md:pt-0 items-center justify-between h-screen w-screen overflow-x-hidden">
        <div className="max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] 3xl:max-w-[900px] px-4 lg:px-12">
          <div className="p-8 bg-primary/100 rounded-2xl">
            <h1 className="text-5xl font-bold">
              <span
                style={{
                  background:
                    "-webkit-linear-gradient(-70deg, #3bf0e4 0%, #bca1f7 100%)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Secure
              </span>{" "}
              your{" "}
              <span
                style={{
                  background:
                    "-webkit-linear-gradient(-70deg, #f0cf3b 0%, #a1f7a8 100%)",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Smart Contract
              </span>
            </h1>
            <p className="py-8">
              Veniam amet officia et quis officia aliquip adipisicing. Elit
              nulla ad esse cillum commodo exercitation deserunt in laborum
              commodo. Non cillum laboris anim nisi culpa ea veniam ea duis
              incididunt.
              <br />
              Tempor esse veniam duis magna laborum duis enim. Consectetur enim
              culpa exercitation est aliquip consectetur minim. Irure qui ex
              Lorem consequat aliqua nostrud ad adipisicing aliquip fugiat
              labore fugiat do reprehenderit. Anim et culpa dolor cupidatat
              mollit aliquip.
            </p>
            <div className="flex flex-row-reverse">
              <button
                className="relative bg-blue-600 px-4 py-px rounded-sm hover:animate-shake z-10"
                onClick={() => setHideModel(false)}
              >
                Analyze!
              </button>
            </div>
          </div>

          <div></div>
        </div>

        <picture className="hidden lg:block absolute right-0">
          <img
            src={platformImage}
            alt="Segeth analysing a contract address"
            className="rounded-xl lg:h-[50vh] xl:h-[60vh] 2xl:h-[70vh] transform translate-x-1/2 transition hover:translate-x-1/4 relative z-10"
            style={{
              boxShadow: "0px 30px 90px #1e091f, -30px -30px 90px #1c1047",
            }}
          />
        </picture>
      </div>

      <AnalysisFormModel hide={hideModel} setHide={setHideModel} />

      <BlobBackground />
    </>
  );
};

export default HomePage;
