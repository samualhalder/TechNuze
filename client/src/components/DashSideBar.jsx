import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowRight } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

function DashSideBar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlTab = urlParams.get("tab");
    setTab(urlTab);
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"?tab=profile"}>
            <Sidebar.Item active={tab === "profile"} icon={HiUser} label="user">
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowRight}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSideBar;
