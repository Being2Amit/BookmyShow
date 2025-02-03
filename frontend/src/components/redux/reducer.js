const loadState = () => {
    try {
        const serializedState = localStorage.getItem("reduxState");
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("reduxState", serializedState);
    } catch (err) {
        console.error("Failed to save state:", err);
    }
};

// Define initial state
const initialState = loadState() || { data: [], location: { city: '', language: ['empty'] } };

const myreducer = (state = initialState, action) => {
    let newState;
    
    if (action.type === 'movies-title') {
        newState = { ...state, data: action.payload };
    } else if (action.type === 'location') {
        newState = { ...state, location: action.payload };
    } else if (action.type === 'LOGOUT') {
        // Clear localStorage and reset state on logout
        localStorage.removeItem("reduxState");
        newState = { data: [], location: { city: '', language: ['empty'] } };
    } else {
        newState = state;
    }

    // Save the new state to localStorage (except when logging out)
    if (action.type !== 'LOGOUT') {
        saveState(newState);
    }

    return newState;
};

export default myreducer;
