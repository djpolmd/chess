
import Redis from 'ioredis';
import config from '#config';

const client = new Redis(config.UPSTASH_REDIS_CONN)

// TODO: Rename method to incrementCount
export const incrementCount = (urlPartial: string) => {
    return client.zincrby('myPageCounts', 1, urlPartial)
}

// TODO: Rename method to getPageCount
export const getPageCount = (urlPartial: string) => {
    return client.zscore('myPageCounts', urlPartial)
}