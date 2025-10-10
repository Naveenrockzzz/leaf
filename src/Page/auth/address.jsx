import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { createUserAddress } from "../../feature/leafSlice";
import { fetchUserData } from "../../helper/helper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Address = () => {
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();
  const { id } = fetchUserData();
  const navigate = useNavigate();
  const uid = localStorage.getItem("leafUserid");

  const { loading } = useSelector((state) => state.leaf.user);
  const [userAddress, setUserAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    district: "",
    pin_code: "",
    user_account: id ?? uid,
  });

  const fetchCountryData = async () => {
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/states"
      );
      const defaultCountry = response?.data?.data.find(
        (country) => country.name === "India"
      );
      setStates(defaultCountry ? defaultCountry.states : []);
    } catch (error) {
      console.error("Error fetching countries and states", error);
    }
  };

  const handleOnchange = (e) => {
    setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
  };

  const handleStateChange = (event, value) => {
    setUserAddress({ ...userAddress, state: value });
  };
  useEffect(() => {
    fetchCountryData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createUserAddress(userAddress))
      .unwrap()
      .then((res) => {
        toast.success("Your Address has been created");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Something went wrong please try again");
      });
  };
  return (
    <div className="  py-8  flex flex-col items-center">
      <div className="sm:w-[440px]  w-[320px]  ">
        <div className=" shadow-2xl  rounded-xl px-4 py-6 w-full form_section">
          <form onSubmit={handleSubmit}>
            <div>
              <p className="text-2xl text-center mb-6 text-black-400 ">
                Create Your Delivery Address
              </p>

              <div className="flex flex-col gap-3">
                <TextField
                  label=" Address line 1 "
                  variant="filled"
                  className="w-full bg-white rounded"
                  name="address1"
                  required
                  value={userAddress?.address1}
                  onChange={handleOnchange}
                />

                <TextField
                  label="Address line 2 "
                  variant="filled"
                  className="w-full bg-white rounded"
                  name="address2"
                  value={userAddress?.address2}
                  onChange={handleOnchange}
                />
                <TextField
                  label="Town / City"
                  variant="filled"
                  className="w-full bg-white rounded"
                  name="city"
                  required
                  value={userAddress?.city}
                  onChange={handleOnchange}
                />

                <TextField
                  label="District"
                  variant="filled"
                  required
                  className="w-full bg-white rounded"
                  name="district"
                  value={userAddress?.district}
                  onChange={handleOnchange}
                />

                <TextField
                  label="Pin Code"
                  variant="filled"
                  required
                  className="w-full bg-white rounded border border-gray-500"
                  name="pin_code"
                  value={userAddress?.pin_code}
                  onChange={handleOnchange}
                />
                {/* State */}
                <Autocomplete
                  className="bg-white text-blue-500 rounded w-full"
                  value={userAddress?.state}
                  onChange={handleStateChange}
                  options={states.map((state) => state.name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="State"
                      variant="filled"
                    />
                  )}
                />
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-between mt-6 items-center">
              <button
                type="submit"
                className="bg-primary w-full hover:bg-green-500 cursor-pointer px-4 py-3 text-white rounded-xl"
              >
                {loading ? "Processing..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
