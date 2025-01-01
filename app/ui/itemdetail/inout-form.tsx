'use client';

import { useState } from 'react';
import { createItemHistory } from '@/app/lib/actions';
import { Agent } from '@/app/lib/definitions';

export default function InOutForm({ agents, itemid, isImport }: { agents: Agent[], itemid: string, isImport:boolean }) {
    const [agentid, setAgentid] = useState('');
    const [volume, setVolume] = useState('');
    // const [inbound, setInbound] = useState(false);
    const [outsup, setOutsup] = useState(false);
    const [createat, setCreateat] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async () => {
        const itemData = {
            itemid,
            agentid: agentid,
            volume: parseInt(volume),
            inbound: isImport ? true : false,
            outsup,
            createat
        };

        console.log('Submitting item history:', itemData);

        const result = await createItemHistory(itemData);
        console.log('Result:', result);
    };

    return (
        <div className="bg-gray-200 rounded-md p-4 text-black">
            <form className="flex-col" onSubmit={(e) => e.preventDefault()}>
                <label className="flex justify-between items-center">
                    <span>Agent:</span>
                    <select className="bg-white rounded-md p-1 m-2"
                        value={agentid} onChange={(e) => setAgentid(e.target.value)}>
                        <option value="">No Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.agent}</option>
                        ))}
                    </select>
                </label>
                <label className="flex justify-between items-center w-full">
                    <span>Số lượng:</span>
                    <input className="bg-white rounded-md p-1 m-2 custom-input w-1/2"
                        type="text"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                    />
                </label>
                {!isImport && (
                    <>
                    <label className="flex justify-between items-center">
                        <span>Xuất bù:</span>
                        <input className="bg-white rounded-md p-1 m-2"
                            type="checkbox"
                            checked={outsup}
                            onChange={(e) => setOutsup(e.target.checked)}
                        />
                    </label>
                    </>
                )}
                <label className="flex justify-between items-center">
                    <span>Ngày:</span>
                    <input className="bg-white rounded-md p-1 m-2"
                        type="date"
                        value={createat}
                        onChange={(e) => setCreateat(e.target.value)}
                    />
                </label>
                <div className="flex justify-end m-2">
                    <button
                        className="bg-blue-400 text-white hover:bg-blue-500 px-4 rounded-md border-y-red-500 shadow-lg"
                        type="button"
                        onClick={handleSubmit}
                    >OK
                    </button>
                </div>
            </form>
        </div>
    );
}
