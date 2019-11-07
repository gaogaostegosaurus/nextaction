let priorityArray = [];
let actionArray = [];
let cooldownArray = [];
let countdownArrayA = [];
let countdownArrayB = [];
let recastTracker = []; // Holds timestamps for cooldowns
let statusTracker = {}; // Holds timestamps for statuses
let cooldowntime = {}; // Holds timestamps for cooldowns
let actionList = {};
let player = {};
let target = {};


const removeAnimationTime = 1000;

const timeout = {}; // For timeout variables
const interval = {};
const nextid = {}; // Store document id - location on page for icons, etc.
const countdownid = {};
const toggle = {}; // Toggley things
const count = {}; // County things?
let potency = {};
let previous = {};
let next = {};
