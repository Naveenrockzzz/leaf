import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { CloudUpload, Close } from "@mui/icons-material";
import GradeIcon from "@mui/icons-material/Grade";
import { toast } from "react-toastify";
import { createReview } from "../../feature/leafSlice";
import { fetchUserData } from "../../helper/helper";

export const Review = () => {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validImageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validImageFiles.length !== files.length) {
      toast.warn("Only image files are allowed.");
    }

    const imageURLs = validImageFiles.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageURLs]);
    setImageFiles((prevFiles) => [...prevFiles, ...validImageFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!rating || !reviewText) {
      toast.error("Please provide a rating and review text");
      return;
    }

    const userData = fetchUserData();
    if (!userData?.id) {
      toast.error("Please login to submit a review");
      navigate("/sign-in");
      return;
    }

    try {
      const reviewData = {
        rating,
        description: reviewText,
        product: productId,
        user: userData.id,
      };

      await dispatch(createReview(reviewData)).unwrap();
      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setImages([]);
      setImageFiles([]);
      navigate(-1);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <section className="md:px-[10%] sm:px-[5%] px-2 py-4 mt-2 w-[60%] m-auto">
      {/* Product Display */}
      <h3 className="mt-5 text-lg font-semibold">Write a Review</h3>

      <div className="flex mt-6 items-center gap-4">
        <img
          src="http://localhost:5173/src/assets/banner.png"
          alt="Product"
          className="size-20 rounded-md object-cover shadow-2xl "
        />
        <h2 className="text-xl font-semibold">How was the item?</h2>
      </div>

      {/* Star Rating */}
      <div className="flex my-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <GradeIcon
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer ${
              rating >= star ? "text-yellow-500" : "text-gray-400"
            }`}
            sx={{ fontSize: "36px" }}
          />
        ))}
      </div>

      {/* Review Text */}
      <TextField
        label="What should other customers know?"
        multiline
        rows={4}
        className="w-full mt-2"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={src}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                className="absolute top-1 right-1 cursor-pointer size-6 flex items-center justify-center bg-red-500 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <Close fontSize="small" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Upload Section */}
      <label className="border border-gray-300 mt-4 p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-100 rounded-md">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
        <CloudUpload className="text-gray-500" fontSize="large" />
        <p className="text-gray-700 mt-2">Share multiple photos</p>
      </label>

      {/* Submit Button */}
      <div className="text-center">
        <button 
          onClick={handleSubmit}
          className="bg-blue-800 w-1/2 py-3 text-xl text-white rounded-md mt-6 hover:bg-blue-900 transition"
        >
          Submit
        </button>
      </div>
    </section>
  );
};
