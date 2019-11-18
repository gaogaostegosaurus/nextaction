let iconArrayA = [];
let iconArrayB = [];
let iconArrayC = [];
let countdownArrayA = [];
let countdownArrayB = [];
let countdownArrayC = [];

// Objects
let recastTracker = {}; // Holds timestamps for cooldowns
let statusTracker = {}; // Holds timestamps for statuses
let cooldowntime = {}; // Holds timestamps for cooldowns
let player = {};
let target = {};

// RegEx matching strings
player.gcd = 2500;


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

const onAction = {};
const onCasting = {};
const onCancel = {};
const onStatus = {};

const onTargetChanged = {};
const onJobChange = {};
