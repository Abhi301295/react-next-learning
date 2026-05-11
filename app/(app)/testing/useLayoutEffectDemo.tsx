"use client";
import { Button } from '@/components/ui/Button';
import { useLayoutEffect, useState } from 'react'

const userIds = [1, 2];
const UseLayoutEffectDemo = () => {
    const [userId, setUserId] = useState(userIds[0]);
    const [isAdmin, setIsAdmin] = useState(false);
  
    // This artificially slows down rendering
    let now = performance.now();
    while (performance.now() - now < 200) {
      // Do nothing for a bit...
    }
  
    // useEffect(() => {
    //   setIsAdmin(userId === userIds[0]);
    // }, [userId]);

    useLayoutEffect(() => {
        setIsAdmin(userId === userIds[0]);
      }, [userId]);
  
    const handleChange = () => {
      const otherId = userIds.find((id) => id !== userId)!;
      setUserId(otherId);
    };
  
    return (
      <div className='tutorial-shorts'>
        <p>userId: {userId}</p>
        <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
        <Button onClick={handleChange}>Change User</Button>
      </div>
    );
}

export default UseLayoutEffectDemo;