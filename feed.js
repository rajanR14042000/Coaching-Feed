import express from 'express';
import  Feed from  "../model/feed.js";
import redisClient from '../config/redis.js';

const router = express.Router();

let io;

const setIo = (socketIo) => {
  io = socketIo;
}

router.get("/", async (req, res) => {
  try {
    const cached = await redisClient.get("feeds");

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const feeds = await Feed.find().sort({ createdAt: -1 });

    await redisClient.set("feeds", JSON.stringify(feeds), {
      EX: 60, // cache 60 seconds
    });

    res.json(feeds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/post", async (req, res) => {
  try {
    const { message } = req.body;

    const feed = await Feed.create({ message });

    // Clear cache
    await redisClient.del("feeds");

    // Emit realtime event
    io.emit("new-feed", feed);

    res.status(201).json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { setIo };
export default router;
