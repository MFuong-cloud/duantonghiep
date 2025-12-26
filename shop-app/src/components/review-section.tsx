"use client";

import { Star, ThumbsUp, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Review {
    id: number;
    userName: string;
    avatar?: string;
    rating: number;
    date: string;
    comment: string;
    type: "food" | "service";
    likes: number;
    images?: string[];
}

const hardcodedReviews: Review[] = [
    {
        id: 1,
        userName: "Nguyễn Văn An",
        rating: 5,
        date: "15/12/2024",
        comment: "Món ăn rất ngon, đặc biệt là bò bít tết sốt tiêu đen. Không gian sang trọng, phục vụ nhiệt tình. Chắc chắn sẽ quay lại!",
        type: "food",
        likes: 24,
        images: ["/image/homepage/dish1.jpg", "/image/homepage/dish2.jpg"]
    },
    {
        id: 2,
        userName: "Trần Thị Bình",
        rating: 4,
        date: "10/12/2024",
        comment: "Đồ ăn ngon, giá cả hợp lý. Nhân viên phục vụ rất chu đáo và thân thiện. Tuy nhiên thời gian chờ món hơi lâu.",
        type: "service",
        likes: 18
    },
    {
        id: 3,
        userName: "Lê Hoàng Cường",
        rating: 5,
        date: "08/12/2024",
        comment: "Lẩu Thái hải sản tuyệt vời! Nước lẩu đậm đà, hải sản tươi sống. View đẹp, rất phù hợp để đưa gia đình đến ăn cuối tuần.",
        type: "food",
        likes: 32,
        images: ["/image/homepage/dish4.jpg"]
    },
    {
        id: 4,
        userName: "Phạm Minh Đức",
        rating: 4,
        date: "05/12/2024",
        comment: "Không gian rộng rãi, thoáng mát. Món cá hồi nướng mật ong rất đáng thử. Giá hơi cao nhưng xứng đáng với chất lượng.",
        type: "food",
        likes: 15
    },
    {
        id: 5,
        userName: "Hoàng Thị Én",
        rating: 5,
        date: "01/12/2024",
        comment: "Đã đặt bàn qua app TableGo, rất tiện lợi. Nhà hàng giữ bàn đúng giờ. Thức ăn phục vụ nhanh, ngon miệng. 10 điểm!",
        type: "service",
        likes: 27
    },
    {
        id: 6,
        userName: "Võ Quang Hải",
        rating: 3,
        date: "28/11/2024",
        comment: "Đồ ăn ổn nhưng không có gì quá đặc biệt. Giá khá cao so với phần ăn. Phục vụ tốt, không gian đẹp.",
        type: "food",
        likes: 8
    }
];

const ratingStats = {
    average: 4.8,
    total: 230,
    distribution: [
        { stars: 5, count: 156, percent: 68 },
        { stars: 4, count: 52, percent: 23 },
        { stars: 3, count: 15, percent: 6 },
        { stars: 2, count: 5, percent: 2 },
        { stars: 1, count: 2, percent: 1 }
    ]
};

export default function ReviewSection() {
    const [filter, setFilter] = useState<"all" | "food" | "service">("all");
    const [showAll, setShowAll] = useState(false);

    const filteredReviews = hardcodedReviews.filter(
        (review) => filter === "all" || review.type === filter
    );

    const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 4);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Đánh giá từ khách hàng</h2>
            </div>

            {/* Rating Overview */}
            <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row gap-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center md:border-r md:pr-8">
                    <div className="text-5xl font-bold text-gray-800">{ratingStats.average}</div>
                    <div className="flex gap-1 my-2">
                        {renderStars(Math.round(ratingStats.average))}
                    </div>
                    <p className="text-gray-500 text-sm">{ratingStats.total} đánh giá</p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {ratingStats.distribution.map((item) => (
                        <div key={item.stars} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-12">{item.stars} sao</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                    style={{ width: `${item.percent}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-500 w-12">{item.percent}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setFilter("food")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "food"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    Món ăn
                </button>
                <button
                    onClick={() => setFilter("service")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "service"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    Dịch vụ
                </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {displayedReviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                {review.avatar ? (
                                    <Image
                                        src={review.avatar}
                                        alt={review.userName}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-6 h-6 text-orange-600" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                                    <span className="text-sm text-gray-400">{review.date}</span>
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">{renderStars(review.rating)}</div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${review.type === "food"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {review.type === "food" ? "Món ăn" : "Dịch vụ"}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-3">{review.comment}</p>

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mb-3">
                                        {review.images.map((img, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
                                                <Image
                                                    src={img}
                                                    alt={`Review image ${idx + 1}`}
                                                    fill
                                                    className="object-cover hover:scale-110 transition-transform cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Like Button */}
                                <button className="flex items-center gap-1 text-gray-400 hover:text-orange-600 transition-colors text-sm">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Hữu ích ({review.likes})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {filteredReviews.length > 4 && (
                <div className="text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-6 py-2 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
                    >
                        {showAll ? "Thu gọn" : `Xem thêm ${filteredReviews.length - 4} đánh giá`}
                    </button>
                </div>
            )}
        </div>
    );
}
