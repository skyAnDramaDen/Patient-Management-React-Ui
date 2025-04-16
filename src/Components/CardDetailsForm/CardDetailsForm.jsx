import { CardElement } from '@stripe/react-stripe-js';

function CardDetailsForm({ handleInput }) {
    return (
        <div>
            <label>Card Details:</label>
            <CardElement onChange={handleInput} />
        </div>
    );
}

export default CardDetailsForm;
