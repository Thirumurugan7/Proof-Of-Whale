//@ts-ignore
import { require } from "@hyperoracle/zkgraph-lib";
import { Bytes, Block, Event } from "@hyperoracle/zkgraph-lib";

let addr = Bytes.fromHexString("0xCf9806782983Bc77fB1e11698F49AAc663256252");
let esig_sync = Bytes.fromHexString(
  "0xe042dea0369874bdf3073f2cb0bf2cfe600e28ef752d9b5992ca184185f621c2"
);

export function handleBlocks(blocks: Block[]): Bytes {
  // init output state
  let state: Bytes;

  // #1 can access all (matched) events of the latest block
  let events: Event[] = blocks[0].events;

  // #2 also can access (matched) events of a given account address (should present in yaml first).
  // a subset of 'events'
  let eventsByAcct: Event[] = blocks[0].account(addr).events;

  // #3 also can access (matched) events of a given account address & a given esig  (should present in yaml first).
  // a subset of 'eventsByAcct'
  let eventsByAcctEsig: Event[] = blocks[0]
    .account(addr)
    .eventsByEsig(esig_sync);

  // require match event count > 0
  require(eventsByAcctEsig.length > 0);

  // this 2 way to access event are equal effects, alway true when there's only 1 event matched in the block (e.g. block# 2279547 on sepolia).
  require(events[0].data == eventsByAcct[0].data &&
    events[0].data == eventsByAcctEsig[0].data);

  // set state to the address of the 1st (matched) event, demo purpose only.
  state = events[0].address;

  return state;
}
