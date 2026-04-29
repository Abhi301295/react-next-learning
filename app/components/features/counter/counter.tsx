'use client';
import { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

type CounterProps = {
    initialValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
};
const Counter = ({
    initialValue = 0,
    min = -Infinity,
    max = Infinity,
    step = 1,
    onChange
}: CounterProps) => {

    const [count, setCount] = useState(initialValue);
    useEffect(() => {
        onChange?.(count);
    }, [count, onChange]);

    const increment = () => {
        setCount(prev => Math.min(prev + step, max));
    };

    const decrement = () => {
        setCount(prev => Math.max(prev - step, min));
    };

    const reset = () => {
        setCount(initialValue);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Counter Card</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-lg font-semibold">Count: {count}</p>

                <div className='flex justify-between gap-2'>
                    <Button
                        onClick={decrement}
                        disabled={count <= min}
                        variant="outline"
                    >
                        -
                    </Button>

                    <Button onClick={reset} variant="secondary">
                        Reset
                    </Button>

                    <Button
                        onClick={increment}
                        disabled={count >= max}
                    >
                        +
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default Counter;