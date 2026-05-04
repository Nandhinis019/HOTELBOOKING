require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Hotel.deleteMany({});
        await Room.deleteMany({});

        console.log('Cleared existing data');

        // Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@zova.com',
            password: 'admin123',
            phone: '+1234567890',
            role: 'admin'
        });

        console.log('Created admin user: admin@zova.com / admin123');

        // Create sample user
        await User.create({
            name: 'John Doe',
            email: 'user@zova.com',
            password: 'user123',
            phone: '+0987654321',
            role: 'user'
        });

        console.log('Created test user: user@zova.com / user123');

        // Create hotels in different cities (10 hotels per city)
        const hotels = [
            // Mumbai Hotels (10)
            {
                name: 'Grand Mumbai Palace',
                description: 'Luxury hotel in the heart of Mumbai with stunning city views',
                city: 'mumbai',
                address: '123 Marine Drive, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking'],
                rating: 4.5
            },
            {
                name: 'Taj Mahal Palace Mumbai',
                description: 'Iconic heritage hotel overlooking the Gateway of India',
                city: 'mumbai',
                address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
                amenities: ['WiFi', 'Pool', 'Spa', 'Fine Dining', 'Bar', 'Valet Parking'],
                rating: 4.9
            },
            {
                name: 'Bandra Boutique Hotel',
                description: 'Trendy boutique hotel in the vibrant Bandra neighborhood',
                city: 'mumbai',
                address: '456 Linking Road, Bandra West, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
                amenities: ['WiFi', 'Rooftop Bar', 'Restaurant', 'Gym', 'Parking'],
                rating: 4.3
            },
            {
                name: 'Juhu Beach Resort',
                description: 'Beachfront resort with stunning Arabian Sea views',
                city: 'mumbai',
                address: '789 Juhu Tara Road, Juhu, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
                amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Spa', 'Water Sports'],
                rating: 4.6
            },
            {
                name: 'Powai Lake View Hotel',
                description: 'Serene hotel overlooking Powai Lake',
                city: 'mumbai',
                address: '321 Powai Lake Road, Powai, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
                amenities: ['WiFi', 'Lake View', 'Restaurant', 'Gym', 'Conference Rooms'],
                rating: 4.2
            },
            {
                name: 'Andheri Business Suites',
                description: 'Modern business hotel near Mumbai Airport',
                city: 'mumbai',
                address: '654 Western Express Highway, Andheri, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
                amenities: ['WiFi', 'Airport Shuttle', 'Business Center', 'Restaurant', 'Gym'],
                rating: 4.1
            },
            {
                name: 'Worli Sea Link Hotel',
                description: 'Premium hotel with views of the iconic Sea Link',
                city: 'mumbai',
                address: '987 Annie Besant Road, Worli, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
                amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Parking'],
                rating: 4.7
            },
            {
                name: 'Colaba Heritage Inn',
                description: 'Charming heritage property in historic Colaba',
                city: 'mumbai',
                address: '234 Colaba Causeway, Colaba, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Heritage Tours', 'Room Service'],
                rating: 4.4
            },
            {
                name: 'Lower Parel Corporate Hotel',
                description: 'Contemporary hotel in the business district',
                city: 'mumbai',
                address: '567 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
                amenities: ['WiFi', 'Business Center', 'Gym', 'Restaurant', 'Parking'],
                rating: 4.0
            },
            {
                name: 'Versova Beach Hotel',
                description: 'Relaxing beachside retreat in North Mumbai',
                city: 'mumbai',
                address: '890 Versova Beach Road, Andheri West, Mumbai, Maharashtra',
                images: ['https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800'],
                amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Pool', 'Parking'],
                rating: 4.3
            },

            // Bangalore Hotels (10)
            {
                name: 'Bangalore Tech Suites',
                description: 'Modern hotel perfect for business travelers',
                city: 'bangalore',
                address: '789 MG Road, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'],
                amenities: ['WiFi', 'Gym', 'Business Center', 'Restaurant', 'Parking'],
                rating: 4.3
            },
            {
                name: 'Bangalore Garden Resort',
                description: 'Peaceful resort surrounded by lush gardens',
                city: 'bangalore',
                address: '456 Whitefield, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=800'],
                amenities: ['WiFi', 'Pool', 'Garden', 'Restaurant', 'Spa', 'Parking'],
                rating: 4.6
            },
            {
                name: 'Silicon Valley Inn',
                description: 'Budget-friendly hotel in the IT hub',
                city: 'bangalore',
                address: '321 Electronic City, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Parking', 'Conference Room'],
                rating: 4.0
            },
            {
                name: 'Koramangala Boutique Stay',
                description: 'Stylish boutique hotel in trendy Koramangala',
                city: 'bangalore',
                address: '234 80 Feet Road, Koramangala, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
                amenities: ['WiFi', 'Rooftop Cafe', 'Gym', 'Parking'],
                rating: 4.4
            },
            {
                name: 'Indiranagar Urban Hotel',
                description: 'Contemporary hotel in vibrant Indiranagar',
                city: 'bangalore',
                address: '567 100 Feet Road, Indiranagar, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Parking'],
                rating: 4.2
            },
            {
                name: 'Ulsoor Lake Hotel',
                description: 'Scenic hotel overlooking Ulsoor Lake',
                city: 'bangalore',
                address: '890 Ulsoor Lake Road, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
                amenities: ['WiFi', 'Lake View', 'Restaurant', 'Boating', 'Parking'],
                rating: 4.5
            },
            {
                name: 'Jayanagar Family Suites',
                description: 'Comfortable family hotel in residential Jayanagar',
                city: 'bangalore',
                address: '123 9th Block, Jayanagar, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Kids Play Area', 'Parking'],
                rating: 4.1
            },
            {
                name: 'Hebbal Business Park Hotel',
                description: 'Convenient hotel near business parks',
                city: 'bangalore',
                address: '456 Outer Ring Road, Hebbal, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800'],
                amenities: ['WiFi', 'Business Center', 'Gym', 'Restaurant', 'Parking'],
                rating: 4.0
            },
            {
                name: 'Malleshwaram Heritage Hotel',
                description: 'Traditional hotel in old Bangalore charm',
                city: 'bangalore',
                address: '789 Sampige Road, Malleshwaram, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Cultural Tours', 'Parking'],
                rating: 4.3
            },
            {
                name: 'Bannerghatta Nature Resort',
                description: 'Eco-friendly resort near Bannerghatta National Park',
                city: 'bangalore',
                address: '321 Bannerghatta Road, Bangalore, Karnataka',
                images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
                amenities: ['WiFi', 'Nature Trails', 'Restaurant', 'Safari Tours', 'Parking'],
                rating: 4.7
            },

            // Chennai Hotels (10)
            {
                name: 'Chennai Beach Resort',
                description: 'Beachfront property with amazing ocean views',
                city: 'chennai',
                address: '321 Beach Road, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
                amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Spa'],
                rating: 4.6
            },
            {
                name: 'Marina Grand Hotel',
                description: 'Elegant hotel near Marina Beach',
                city: 'chennai',
                address: '789 Marina Beach Road, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Parking'],
                rating: 4.4
            },
            {
                name: 'Chennai Heritage Inn',
                description: 'Traditional South Indian hospitality',
                city: 'chennai',
                address: '234 T Nagar, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Room Service', 'Parking'],
                rating: 4.2
            },
            {
                name: 'Mylapore Temple View Hotel',
                description: 'Hotel with views of historic Kapaleeshwarar Temple',
                city: 'chennai',
                address: '567 Kutchery Road, Mylapore, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
                amenities: ['WiFi', 'Temple View', 'Restaurant', 'Cultural Tours'],
                rating: 4.5
            },
            {
                name: 'Adyar Riverside Hotel',
                description: 'Peaceful hotel along Adyar River',
                city: 'chennai',
                address: '890 Adyar Club Gate Road, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
                amenities: ['WiFi', 'River View', 'Restaurant', 'Gym', 'Parking'],
                rating: 4.3
            },
            {
                name: 'Anna Nagar Business Suites',
                description: 'Modern hotel in residential Anna Nagar',
                city: 'chennai',
                address: '123 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
                amenities: ['WiFi', 'Business Center', 'Restaurant', 'Gym', 'Parking'],
                rating: 4.1
            },
            {
                name: 'Velachery Tech Park Hotel',
                description: 'Convenient hotel near IT corridor',
                city: 'chennai',
                address: '456 Velachery Main Road, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
                amenities: ['WiFi', 'Business Center', 'Restaurant', 'Parking'],
                rating: 4.0
            },
            {
                name: 'Besant Nagar Beach Hotel',
                description: 'Relaxing beachside hotel in Bessie',
                city: 'chennai',
                address: '789 Elliot Beach Road, Besant Nagar, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
                amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Cafe', 'Parking'],
                rating: 4.4
            },
            {
                name: 'Egmore Central Hotel',
                description: 'Convenient hotel near railway station',
                city: 'chennai',
                address: '234 Pantheon Road, Egmore, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Room Service', 'Parking'],
                rating: 3.9
            },
            {
                name: 'OMR IT Corridor Hotel',
                description: 'Premium hotel on Old Mahabalipuram Road',
                city: 'chennai',
                address: '567 OMR, Thoraipakkam, Chennai, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=800'],
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Business Center', 'Parking'],
                rating: 4.6
            },

            // Coimbatore Hotels (10)
            {
                name: 'Coimbatore Hill View',
                description: 'Scenic hotel with views of Western Ghats',
                city: 'coimbatore',
                address: '567 Avinashi Road, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Gym', 'Parking', 'Mountain View'],
                rating: 4.5
            },
            {
                name: 'Manchester of South Hotel',
                description: 'Modern business hotel in textile city',
                city: 'coimbatore',
                address: '890 RS Puram, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800'],
                amenities: ['WiFi', 'Business Center', 'Restaurant', 'Bar', 'Parking'],
                rating: 4.3
            },
            {
                name: 'Coimbatore Comfort Suites',
                description: 'Comfortable stay near airport',
                city: 'coimbatore',
                address: '123 Peelamedu, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Airport Shuttle', 'Parking'],
                rating: 4.1
            },
            {
                name: 'Gandhipuram Central Hotel',
                description: 'Centrally located hotel in heart of city',
                city: 'coimbatore',
                address: '456 Gandhipuram Main Road, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Shopping Access', 'Parking'],
                rating: 4.0
            },
            {
                name: 'Saibaba Colony Hotel',
                description: 'Peaceful hotel in residential area',
                city: 'coimbatore',
                address: '789 Saibaba Colony, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Gym', 'Parking'],
                rating: 4.2
            },
            {
                name: 'Brookefields Mall Hotel',
                description: 'Modern hotel near shopping district',
                city: 'coimbatore',
                address: '234 Brookefields, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Shopping Access', 'Gym', 'Parking'],
                rating: 4.3
            },
            {
                name: 'Singanallur Lake View',
                description: 'Serene hotel overlooking Singanallur Lake',
                city: 'coimbatore',
                address: '567 Singanallur, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800'],
                amenities: ['WiFi', 'Lake View', 'Restaurant', 'Bird Watching', 'Parking'],
                rating: 4.4
            },
            {
                name: 'Podanur Junction Hotel',
                description: 'Convenient hotel near railway junction',
                city: 'coimbatore',
                address: '890 Podanur, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Room Service', 'Parking'],
                rating: 3.9
            },
            {
                name: 'Ukkadam Business Inn',
                description: 'Budget hotel in commercial area',
                city: 'coimbatore',
                address: '123 Ukkadam, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Parking'],
                rating: 3.8
            },
            {
                name: 'Race Course Hotel',
                description: 'Premium hotel near Race Course',
                city: 'coimbatore',
                address: '456 Race Course Road, Coimbatore, Tamil Nadu',
                images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Parking'],
                rating: 4.6
            },

            // Kerala Hotels (10)
            {
                name: 'Kerala Backwater Resort',
                description: 'Luxury resort on the serene backwaters of Alleppey',
                city: 'kerala',
                address: '456 Backwater Road, Alleppey, Kerala',
                images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
                amenities: ['WiFi', 'Pool', 'Houseboat Tours', 'Restaurant', 'Spa', 'Ayurveda Center'],
                rating: 4.8
            },
            {
                name: 'Gods Own Country Hotel',
                description: 'Premium hotel in the heart of Kochi',
                city: 'kerala',
                address: '789 Marine Drive, Kochi, Kerala',
                images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Parking', 'Sea View'],
                rating: 4.6
            },
            {
                name: 'Munnar Hill Station Inn',
                description: 'Cozy hotel surrounded by tea plantations',
                city: 'kerala',
                address: '234 Tea Estate Road, Munnar, Kerala',
                images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Mountain View', 'Trekking Tours', 'Parking'],
                rating: 4.7
            },
            {
                name: 'Kovalam Beach Resort',
                description: 'Beachfront resort with stunning Arabian Sea views',
                city: 'kerala',
                address: '567 Lighthouse Beach, Kovalam, Kerala',
                images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=800'],
                amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Spa', 'Water Sports'],
                rating: 4.7
            },
            {
                name: 'Thekkady Wildlife Hotel',
                description: 'Nature resort near Periyar Wildlife Sanctuary',
                city: 'kerala',
                address: '890 Thekkady Road, Kumily, Kerala',
                images: ['https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Wildlife Tours', 'Spice Plantation Tours', 'Parking'],
                rating: 4.5
            },
            {
                name: 'Wayanad Green Valley Resort',
                description: 'Eco-resort in the misty hills of Wayanad',
                city: 'kerala',
                address: '123 Vythiri, Wayanad, Kerala',
                images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
                amenities: ['WiFi', 'Nature Trails', 'Restaurant', 'Campfire', 'Parking'],
                rating: 4.6
            },
            {
                name: 'Kumarakom Lake Resort',
                description: 'Luxury resort on Vembanad Lake',
                city: 'kerala',
                address: '456 Kumarakom, Kottayam, Kerala',
                images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
                amenities: ['WiFi', 'Pool', 'Houseboat Rides', 'Restaurant', 'Spa', 'Ayurveda'],
                rating: 4.9
            },
            {
                name: 'Varkala Cliff Hotel',
                description: 'Stunning hotel on the cliffs of Varkala',
                city: 'kerala',
                address: '789 North Cliff, Varkala, Kerala',
                images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'],
                amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Yoga Classes', 'Cliff View'],
                rating: 4.5
            },
            {
                name: 'Trivandrum City Hotel',
                description: 'Modern hotel in the capital city',
                city: 'kerala',
                address: '234 MG Road, Trivandrum, Kerala',
                images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
                amenities: ['WiFi', 'Restaurant', 'Business Center', 'Gym', 'Parking'],
                rating: 4.2
            },
            {
                name: 'Kannur Beach Heritage',
                description: 'Heritage property near pristine beaches',
                city: 'kerala',
                address: '567 Payyambalam Beach, Kannur, Kerala',
                images: ['https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800'],
                amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Cultural Shows', 'Parking'],
                rating: 4.4
            }
        ];

        let totalRooms = 0;
        for (const hotelData of hotels) {
            const hotel = await Hotel.create(hotelData);
            console.log(`Created hotel: ${hotel.name}`);

            // Create rooms for each hotel
            const roomTypes = [
                { type: 'Single', price: 2000, capacity: 1, count: 3 },
                { type: 'Double', price: 3500, capacity: 2, count: 5 },
                { type: 'Deluxe', price: 5000, capacity: 3, count: 3 },
                { type: 'Suite', price: 8000, capacity: 4, count: 2 }
            ];

            let roomNumber = 101;
            for (const roomType of roomTypes) {
                for (let i = 0; i < roomType.count; i++) {
                    await Room.create({
                        hotel: hotel._id,
                        roomNumber: roomNumber.toString(),
                        roomType: roomType.type,
                        pricePerNight: roomType.price,
                        capacity: roomType.capacity,
                        amenities: ['AC', 'TV', 'WiFi', 'Mini Bar', 'Room Service']
                    });
                    roomNumber++;
                    totalRooms++;
                }
            }
        }

        console.log('\n✅ Seed data created successfully!');
        console.log('\nLogin Credentials:');
        console.log('Admin: admin@zova.com / admin123');
        console.log('User: user@zova.com / user123');
        console.log('\nCities Available:');
        console.log('- Mumbai (10 hotels)');
        console.log('- Bangalore (10 hotels)');
        console.log('- Chennai (10 hotels)');
        console.log('- Coimbatore (10 hotels)');
        console.log('- Kerala (10 hotels)');
        console.log(`\nTotal: 50 hotels with ${totalRooms} rooms`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

connectDB().then(() => seedData());
