'use client';

import { Button } from "@/components/ui/Button";
import { initialItems } from "@/lib/utils";
import { useEffect, useState } from "react";

const Day8Client = () => {
  const [count, setCount] = useState(0);
  const [items] = useState(initialItems);

  const selectedItem  = items.find(item => item.isSelected);


  useEffect(() => {
    console.log(count, 'count');
    return () => {
      console.log('clean up', count);
    }
  }, [count]);

  
  return (
    <>
      <div>Day9Client</div>
      <Button variant="primary" onClick={() => setCount(count + 1)}>Increase {count}</Button>
    <div>
      Selected Item: {selectedItem?.id}
    </div>
    </>
  )
}

export default Day8Client;