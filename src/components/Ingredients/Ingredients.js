import React, {useReducer, useEffect, useCallback} from 'react';

import IngredientForm from "./IngredientForm/IngredientForm";
import IngredientList from "./IngredientList/IngredientList";
import Search from "./Search/Search";
import ErrorModal from "../UI/ErrorModal/ErrorModal";

const ingredientReducer = (currentIngredient, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredient, action.ingredient];
        case 'DELETE':
            return currentIngredient.filter(ing => ing.id !== action.id);
        case 'CLEAR':
        default:
            throw new Error('Should not get there!');
    }
};

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...currHttpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR':
            return {...currHttpState, error: null};
        default:
            throw new Error('Should not get there!');
    }
};

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
    const [httpState, dispatchHttp] = useReducer(httpReducer, {});

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        dispatch({type: 'SET', ingredients: filteredIngredients});
    }, []);

    const addIngredientHandler = useCallback(ingredient => {
        dispatchHttp({type: 'SEND'});
        fetch('https://react-hooks-25093.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                dispatchHttp({type: 'RESPONSE'});
                return response.json();
            })
            .then(responseData => {
                dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
            }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message})
        })
    }, []);

    const removeIngredientHandler = useCallback(ingredientId => {
        dispatchHttp({type: 'SEND'});
        fetch(`https://react-hooks-25093.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE'
        }).then(response => {
            dispatchHttp({type: 'RESPONSE'});
            dispatch({type: 'DELETE', id: ingredientId});
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message})
        })
    }, []);

    const clearError = useCallback(() => {
        dispatchHttp({type: 'CLEAR'})
    }, []);

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>
            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={removeIngredientHandler}
                />
            </section>
        </div>
    );
};

export default Ingredients;