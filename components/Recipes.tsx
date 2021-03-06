import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import { Context } from "./Context";

const recipeCategories = [
  { title: "Dishes" },
  { title: "Potions" },
  { title: "All" },
];

const Recipes: React.FC<recipesProps> = (props) => {
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("Dishes");
  const [loading, setLoading] = useState(false);

  const recipeRef: ref = useRef();

  // selection. clone data into here, then filter it based on user selected criteria
  const [selection, setSelection] = useState(props.data.dishes);

  // resets filter on change, returns clean selection based on category
  const handleCategoryChange = () => {
    filter !== "" && setFilter("");
    category === "Potions" && setSelection(props.data.potions);
    category === "Dishes" && setSelection(props.data.dishes);
    category === "All" &&
      setSelection([...props.data.potions, ...props.data.dishes]);
  };
  useEffect(() => {
    handleCategoryChange();
  }, [category]);

  useEffect(() => {
    let filteredSelection: referenceConsumable[] = [];
    selection.filter(
      (e: referenceConsumable) =>
        e.title.toLowerCase().includes(filter.toLowerCase()) &&
        filteredSelection.push(e)
    );
    setSelection(filteredSelection);
    filter === "" && handleCategoryChange();
  }, [filter]);

  return (
    <div className="recipes order-first xl:order-last xl:py-4 flex-1 flex flex-col max-w-screen invisible-scrollbar xl:max-w-3xl xl:min-h-full">
      <div className="flex gap-4 flex-row flex-wrap justify-between lg:border-b-2 border-def mx-6 xl:mx-0 xl:px-1 pb-4 border-opacity-30">
        {/*filter */}
        <input
          type="text"
          placeholder="Search"
          value={filter}
          className="hidden md:block bg-black py-1 px-2 w-44 text-def rounded transition duration-300 focus:outline-none focus:ring focus:ring-def focus:ring-opacity-50"
          onChange={(e) => setFilter(e.target.value)}
        />
        {/*category*/}
        <div className="p-1 bg-black rounded-sm bg-opacity-80 max-w-max">
          <div className="flex items-center gap-2 border border-def border-opacity-30 px-2">
            {recipeCategories.map(({ title }, i) => (
              <h2
                key={i}
                onClick={() => {
                  setCategory(title);
                  recipeRef.current.scrollTo(0, 0);
                }}
                className={`italic font-bold text-xl opacity-30 hover:opacity-100 transition duration-500 ${
                  title === category && "opacity-100"
                }`}
              >
                {title}
              </h2>
            ))}
          </div>
        </div>
      </div>
      {/*scrollable recipes go here */}
      <div className="relative max-w-full w-full flex-1 overflow-scroll invisible-scrollbar">
        <div
          ref={recipeRef}
          className="recipe-container xl:absolute flex flex-row xl:flex-col gap-4 xl:gap-2 overflow-scroll w-full h-full max-h-full max-w-full invisible-scrollbar px-6 xl:px-0"
        >
          {selection.map((e: referenceConsumable, i: number) => (
            <Recipe
              key={i}
              data={e}
              loading={loading}
              setLoading={setLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

//w32 h32
const Recipe: React.FC<uniqueRecipeProps> = (props) => {
  const { loading, setLoading } = props;
  const [loadingInd, setLoadingInd] = useState(false);
  const { handleCraftRequest } = useContext(Context);
  const craft = async (title: string) => {
    handleLoading();
    try {
      let one = await fetch("./api/craft", {
        method: "POST",
        body: title,
      });
      let two = await one.json();
      return two;
    } catch (e) {
      console.log("smth went wrong");
    }
  };
  function handleLoading() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoadingInd(false);
    }, 4000);
  }
  return (
    <div className="relative max-w-full flex flex-col xlp:flex-row items-center xlp:items-start xlp:gap-8 p-12 xlp:p-6 bg-black bg-opacity-60 rounded-md  mt-4 xlp:first:mt-6 xlp:last:mb-10 xlp:first:ml-0 xlp:last:mr-0">
      <div />
      {/* icon */}
      <div className="relative w-28 h-28 xl:w-32 xl:h-32 flex items-center content-center justify-center">
        <Image
          src={`/${props.data.title}.webp`}
          alt={props.data.title}
          layout="fill"
        />
      </div>
      {/* title, effects, maybe something else */}
      <div className="flex flex-col gap-2 flex-wrap">
        <div className="flex gap-4 max-w-full flex-wrap items-center pb-1 border-b border-def">
          <h1 className="w-full italic font-bold text-3xl text-center xlp:text-left  min-w-max">
            {props.data.title}
          </h1>
        </div>
        {/* ingredients */}
        <div className="flex justify-center xlp:justify-start gap-2">
          {props.data.recipe.map((e, i) => (
            <div
              key={i}
              className="w-14 h-14 xl:w-20 xl:h-20 p-1 rounded-sm bg-black"
            >
              <div className="relative w-full h-full border border-def border-opacity-30">
                <Image src={`/${e.title}.webp`} alt={e.title} layout="fill" />
                <h3 className="absolute bottom-0 right-0 font-bold px-1">
                  x{e.quantity}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* effects */}
      {/*      <div className=" min-w-max pb-8">
        <div className="p-1 bg-black rounded-sm  max-w-max">
          <div className="flex items-center content-center justify-center   border border-def border-opacity-30 p-1 px-1">
            <img src="/heart.svg" alt="heart" />
            <img src="/heart.svg" alt="heart" />
            <img src="/heart.svg" alt="heart" />
            <img src="/heart.svg" alt="heart" />
            <img src="/heart.svg" alt="heart" />
          </div>
        </div>
      </div> */}
      <img
        src="/tlcor.svg"
        alt="tlcor"
        className="absolute z-0 top-0 left-0 p-4 opacity-30"
      />
      <img
        src="/trcor.svg"
        alt="trcor"
        className="absolute top-0 right-0 p-4 opacity-30"
      />
      <img
        src="/blcor.svg"
        alt="blcor"
        className="absolute bottom-0 left-0 p-4 opacity-30"
      />
      {loadingInd ? (
        <div className="absolute bottom-0 right-0 p-4">
          <Loader />
        </div>
      ) : (
        <div
          onClick={() => {
            setLoadingInd(true);
            !loading &&
              craft(props.data.title).then(() =>
                handleCraftRequest(props.data.title)
              );
          }}
          className={`flex items-center gap-2 absolute bottom-0 right-0 p-4 hover:opacity-50 ${
            loading ? "opacity-50 cursor-not-allowed" : "opacity-100"
          } transition duration-500 cursor-pointer`}
        >
          <h3
            className={`hidden 2xl:block italic font-bold text-2xl 
          `}
          >
            Craft
          </h3>
          <img src="/plus.svg" alt="plus" />
        </div>
      )}
    </div>
  );
};

function Loader() {
  return (
    <div className="loader">
      <div className="ball1"></div>
      <div className="ball2"></div>
      <div className="ball3"></div>
    </div>
  );
}

export default Recipes;
