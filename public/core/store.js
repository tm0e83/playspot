import EventBus from './event-bus.js';

/**
 * @typedef {Object} User
 * @property {number} balance
 * @property {string} email
 * @property {boolean} emailVerified
 * @property {string} language
 * @property {string} role
 * @property {string} uid
 * @property {number} totalWinnings
 * @property {Object} gamesPlayed
 * @property {number} gamesPlayed.limbo
 * @property {number} gamesPlayed.mines
 * @property {string} username
 * @property {[]} winningsHistory
 */

/**
 * @typedef {Object} State
 * @property {User} user
 * @property {string} layout
 * @property {string} language
 */

/**
 * @param {State} state
 * @param {*} action
 * @returns {State} new state
 */
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: {
          ...state.user,
          balance: action.payload
        }
      };

    case 'SET_USER':
      if (action.payload === null) {
        return {
          ...state,
          user: {
            balance: 0,
            email: '',
            emailVerified: false,
            language: localStorage.getItem('language') || 'de',
            role: 'guest', // 'guest'|'user'|'admin' (default is 'guest')
            uid: '',
            totalWinnings: 0,
            gamesPlayed: {
              limbo: 0,
              mines: 0
            },
            username: 'John Doe',
            winningsHistory: [],
          }
        };
      }

      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    case 'SET_EMAIL_VERIFIED':
      return {
        ...state,
        user: {
          ...state.user,
          emailVerified: action.payload
        }
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        user: {
          ...state.user,
          language: action.payload
        }
      };

    default:
      return state;
  }
}

class Store extends EventBus {

  /** @type {State} */
  state = {
    user: {
      balance: 0,
      email: '',
      emailVerified: false,
      language: 'de',
      role: 'guest', // 'guest'|'user'|'admin' (default is 'guest')
      uid: '',
      totalWinnings: 0,
      gamesPlayed: {
        limbo: 0,
        mines: 0
      },
      username: 'John Doe',
      winningsHistory: [],
    },
    layout: '',
    language: 'de',
  }

  /**
   * @param {string} type
   * @param {*} payload
   */
  dispatch(type, payload) {
    this.state = reducer(this.state, { type, payload });
    this.publish(type, this.state);
  }

  constructor() {
    super();
  }
}

const store = new Store();

export default store;