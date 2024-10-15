const Hotel=require('../model/hotel')
const getAllHotels=async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
}
const getHotelReviews=async (req, res) => {
    const { hotelId } = req.params;
    const { sort } = req.query;

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        let sortedReviews = hotel.reviews;

        // Sorting logic
        if (sort === 'name') {
            sortedReviews = sortedReviews.sort((a, b) => a.user.localeCompare(b.user));
        } else if (sort === 'rating') {
            sortedReviews = sortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'date') {
            sortedReviews = sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        res.json({ hotelName: hotel.name, reviews: sortedReviews });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
}
const postHotelReview=async (req, res) => {
    const { hotelId } = req.params;
    const { user, rating, comment } = req.body;

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        hotel.reviews.push({ user, rating, comment });
        await hotel.save();

        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
}
module.exports={getAllHotels,getHotelReviews,postHotelReview};