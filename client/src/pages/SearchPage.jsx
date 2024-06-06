import { Button, Dropdown, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTearm: "",
    order: "asc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showmore, setShowmore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setPosts(null);
    const urlParams = new URLSearchParams(location.search);
    const searchTearm = urlParams.get("searchTearm");
    const category = urlParams.get("category");
    const order = urlParams.get("order");
    if (searchTearm || category || order) {
      setSideBarData({ ...sideBarData, searchTearm, order, category });
      console.log("data", sideBarData);
    }
    const fetchData = async () => {
      const serahQuary = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${serahQuary}`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
      }
      setLoading(false);
    };
    fetchData();
  }, [location.search]);
  //   console.log(sideBarData);
  console.log("data", sideBarData);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.id === "searchTearm") {
      setSideBarData({ ...sideBarData, searchTearm: e.target.value });
    }
    if (e.target.id === "order") {
      const sort = e.target.value || "desc";
      setSideBarData({ ...sideBarData, order: sort });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncatagorized";
      setSideBarData({ ...sideBarData, category });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTearm", sideBarData.searchTearm);
    urlParams.set("order", sideBarData.order);
    urlParams.set("category", sideBarData.category);
    const searhQuery = urlParams.toString();
    navigate(`/search?${searhQuery}`);
    console.log("submitted");
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left side */}

      <div className="p-7 border-b md:border-r border-gray-500  md:w-[30%] md:min-h-screen md:text-lg">
        <form className="p-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 items-center m-3">
            <label htmlFor="">Search Term :</label>
            <TextInput
              placeholder="search..."
              id="searchTearm"
              value={sideBarData.searchTearm}
              onChange={handleChange}
            ></TextInput>
          </div>
          <div className="flex gap-4 items-center m-4">
            <label htmlFor="">Order:</label>
            <Select
              onChange={handleChange}
              id="order"
              value={sideBarData.order}
            >
              <option value="asc">Latest</option>
              <option value="desc">Oldest</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center m-4">
            <label htmlFor="">Category:</label>
            <Select
              onChange={handleChange}
              defaultValue={null}
              id="category"
              value={sideBarData.category}
            >
              <option value="nocategory">--Chose one--</option>
              <option value="startup">Start up</option>
              <option value="mnc">MNC</option>
              <option value="latest-tech">Latest Tech</option>
              <option value="hiring">Hiring</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <Button
            className="w-full mt-10"
            gradientDuoTone={"purpleToPink"}
            outline
            type="submit"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Rigth Side */}

      <div className="flex flex-col w-full">
        <h1 className="font-bold text-xl m-5">Results</h1>
        <div className="flex flex-wrap gap-4 m-3">
          {posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {posts && posts.length === 0 && <p className="m-4">No result Found</p>}
        {loading && <Spinner size="xl" className="flex mx-auto"></Spinner>}
      </div>
    </div>
  );
}

export default SearchPage;
