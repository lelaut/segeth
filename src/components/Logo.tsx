import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as LogoIcon } from "../assets/logo.svg";

interface Props {
  className?: string;
  onlyIcon?: boolean;
}

const Logo = ({ className, onlyIcon }: Props) => {
  return (
    <div
      className={"absolute m-8 md:m-12" + (className ? ` ${className}` : "")}
    >
      <Link
        to="/"
        className="flex w-max items-center gap-2 text-2xl text-white font-bold tracking-[0.2em]"
      >
        <LogoIcon fill="white" width="24px" height="24px" className="mt-1" />
        {onlyIcon ? <></> : <h1>segeth</h1>}
      </Link>
    </div>
  );
};

export default Logo;
