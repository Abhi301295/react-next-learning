'use client';

import List from "@/components/shared/list/List";

type User = {
  id: string;
  name: string;
  role: string;
};
const Day3Client = () => {
    const users: User[] = [
        { id: "u1", name: "Rahul", role: "Developer" },
        { id: "u2", name: "Aman", role: "Designer" },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <List
                data={users} // ✅ data comes from here
                getKey={(u) => u.id}
                renderItem={(user) => (
                    <div className="border p-3 rounded">
                        <h2 className="font-semibold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                )}
            />
        </div>
    );
}

export default Day3Client;