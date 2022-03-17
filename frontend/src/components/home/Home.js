import React, { useEffect, useState } from "react";
import { getToken } from "../../redux/selectors";
import { connect } from "react-redux";
import ItemCard from "../itemcard/ItemCard";
import { useNavigate, useLocation } from "react-router-dom";
import "./home.css";

function Home(props) {
  //States
  const [items, setItems] = useState([]);
  const [favourites, setFavourites] = useState({});
  const [filterRange, setFilterRange] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const searchKeyword = location.state ? location.state["searchKeyword"] : "";

  const getAllItems = () => {
    fetch("http://localhost:3001/items/get-all", {
      mode: "cors",
      headers: {
        Authorization: props.token,
      },
    })
      .then((res) => res.json())
      .then((jsonresponse) => {
        console.log(jsonresponse);
        console.log(jsonresponse.message);
        setItems(jsonresponse.message.items);
        setFavourites(jsonresponse.message.favourites);
        console.log("success");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!props.token) {
      navigate("../login", { replace: true });
    } else {
      getAllItems();
    }
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    if (value !== "Select") {
      const [lowRange, highRange] = event.target.value.split("-");
      setFilterRange({
        lowRange: parseInt(lowRange),
        highRange: parseInt(highRange),
      });
    }
    // setFilterRange(value);
  };

  const handleOutOfStockChange = () => {
    setExcludeOutOfStock((prevValue) => !prevValue);
  };

  const sortItems = (value)=>{
    if(value==='Price'){
      console.log("sorting price")
      items.sort((item1,item2)=>item1.price-item2.price);
    }else if(value==='Quantity'){
      console.log("sorting quantity")
      items.sort((item1,item2)=>item1.stock-item2.stock);
    }else if(value==='Sales Count'){
      console.log("sorting sales")
      items.sort((item1,item2)=>item1.sold_count-item2.sold_count);
    }
  }
  const handleSort = (event)=>{
    let value = event.target.value;
    console.log(":vale is",value)
    setSortBy(value);
    sortItems(value);
  }
  const getItem = (item) => (
    <ItemCard
      // key={favourites[item.item_id] || item.item_id}
      item={item}
      favourite={{
        favouriteId: favourites[item.item_id],
        updateFavourites: setFavourites,
      }}
    />
  );
  if(true){

  }
  return (
    <div className="home-container">
      <div className="home-options-container">
        <div className="home-options-price">
      <label htmlFor="priceFilter">Filter by Price:</label>
        <select
          name="filter"
          id="priceFilter"
          className="home-options-price-select"
          // value={filterRange}
          onChange={handleFilterChange}
        >
          <option>Select</option>
          <option>0-100</option>
          <option>101-500</option>
          <option>501-1000</option>
          <option>1001-10000</option>
          <option>10001-1000000</option>
        </select>
        </div>
        <div className="home-options-sortby">
        <label htmlFor="sortyBy">Sort By:</label>
        <select
          name="sort"
          id="sortBy"
          className="home-options-price-select"
          // value={filterRange}
          onChange={handleSort}
        >
          <option>Select</option>
          <option>Price</option>
          <option>Quantity</option>
          <option>Sales Count</option>
        </select>
        </div>
        <div className="home-options-checkbox">
          <label htmlFor="checkbox">Exclude Out of Stock:</label>
          <input
            type="checkbox"
            id="checkbox"
            value={excludeOutOfStock}
            onClick={handleOutOfStockChange}
          ></input>
        </div>
      </div>
      <div className="home-items-container">
        {

          items.map((item) => {
            if (searchKeyword) {
              if (searchKeyword === item.name) {
                if (excludeOutOfStock) {
                  if (item.stock > 0) {
                    if (filterRange.highRange) {
                      let price = parseFloat(item.price).toFixed(2);
                      if (
                        filterRange.lowRange <= price &&
                        filterRange.highRange >= price
                      ) {
                        return getItem(item);
                      }
                    } else {
                      return getItem(item);
                    }
                  }
                } else {
                  if (filterRange.highRange) {
                    let price = parseFloat(item.price).toFixed(2);
                    if (
                      filterRange.lowRange <= price &&
                      filterRange.highRange >= price
                    ) {
                      return getItem(item);
                    }
                  } else {
                    return getItem(item);
                  }
                }
              }
            } else {
              if (excludeOutOfStock) {
                if (item.stock > 0) {
                  if (filterRange.highRange) {
                    let price = parseFloat(item.price).toFixed(2);
                    if (
                      filterRange.lowRange <= price &&
                      filterRange.highRange >= price
                    ) {
                      return getItem(item);
                    }
                  } else {
                    return getItem(item);
                  }
                }
              } else {
                if (filterRange.highRange) {
                  let price = parseFloat(item.price).toFixed(2);
                  if (
                    filterRange.lowRange <= price &&
                    filterRange.highRange >= price
                  ) {
                    return getItem(item);
                  }
                } else {
                  return getItem(item);
                }
              }
            }
          })
        }
      </div>
    </div>
  );
}

export default connect(getToken, null)(Home);
