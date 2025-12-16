import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

/**
 * Redis 1 (source)
 */
const redisSource = createClient({
    url: process.env.REDIS_SOURCE,
});

/**
 * Redis 2 (target)
 */
const redisTarget = createClient({
    url: process.env.REDIS_TARGET,
});

await redisSource.connect();
await redisTarget.connect();

/**
 * Client khusus subscriber (best practice)
 */
const subscriber = redisSource.duplicate();
await subscriber.connect();

console.log("Redis listener started");

/**
 * Subscribe ke event SET
 */
await subscriber.subscribe("__keyevent@0__:set", async (key) => {
    try {
        if (!key.startsWith("armada_trips:")) return;
        const value = await redisSource.get(key);
        if (value !== null) {
            // Set ke redisTarget
            await redisTarget.set(key, value);
        }
    } catch (err) {
        console.error("Error syncing key:", key, err);
    }
});