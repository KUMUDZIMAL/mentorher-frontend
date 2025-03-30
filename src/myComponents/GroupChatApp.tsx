"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Participant {
  _id: string;
  username: string;
}

interface Group {
  _id: string;
  name: string;
  participants: Participant[]; // Updated to an array of objects
}

export default function GroupChatPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [newParticipantUsername, setNewParticipantUsername] = useState('');
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // Fetch active groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/groups');
        if (!res.ok) {
          console.error('Failed to fetch groups');
          return;
        }
        const data = await res.json();
        setGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, []);

  const createGroup = async () => {
    if (!newGroupName.trim() || selectedUsernames.length === 0) return;
    
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName,
          participantUsernames: selectedUsernames,
        })
      });

      if (res.ok) {
        const { group } = await res.json();
        setGroups([...groups, group]);
        setNewGroupName('');
        setSelectedUsernames([]);
        setCurrentGroupId(group._id);
      } else {
        console.error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const addParticipant = async () => {
    if (!currentGroupId || !newParticipantUsername.trim()) return;
  
    try {
      const res = await fetch('/api/groups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentGroupId,
          newParticipantUsername
        }),
        credentials: 'include',
      });
  
      if (res.ok) {
        const { group } = await res.json();
        setGroups(groups.map(g => g._id === group._id ? group : g));
        setNewParticipantUsername('');
      } else {
        console.error('Failed to add participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-3xl mb-6 font-valueSerif text-slate-700">
          Group Chats
        </h1>
        
        {/* Create Group Section */}
        <div className="bg-white/60 p-8 rounded-2xl shadow mb-6">
          <h2 className="text-xl mb-4 font-copernicusMedium text-slate-700">
            Create New Group
          </h2>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full p-3 pr-32 border font-outfitRegular rounded-2xl"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={selectedUsernames.join(',')}
                onChange={(e) =>
                  setSelectedUsernames(
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Participant usernames (comma separated)"
                className="w-full p-3 border font-outfitRegular rounded-2xl"
              />
            </div>
            <button
              onClick={createGroup}
              className="bg-violet-500 text-white px-4 py-1.5 rounded-xl font-outfitRegular hover:scale-[1.02] transition-all duration-300"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* Add Participant Section */}
        {currentGroupId && (
          <div className="bg-white/60 p-8 rounded-2xl shadow mb-6 border">
            <h3 className="text-lg font-copernicusMedium text-slate-700 mb-4">
              Add a Participant to Group
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newParticipantUsername}
                onChange={(e) => setNewParticipantUsername(e.target.value)}
                placeholder="New Participant Username"
                className="w-full p-3 border font-outfitRegular rounded-2xl"
              />
              <button
                onClick={addParticipant}
                className="bg-green-500 text-white px-4 py-1.5 rounded-xl font-outfitRegular hover:scale-[1.02] transition-all duration-300"
              >
                Add Participant
              </button>
            </div>
          </div>
        )}

        {/* Group List */}
        <div className="bg-white/60 rounded-2xl shadow p-8">
          <h2 className="text-xl mb-4 font-copernicusMedium text-slate-700">
            Active Groups
          </h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group._id}
                className="flex items-center justify-between border p-3 rounded-2xl hover:bg-purple-400/20 cursor-pointer transition-all duration-300"
              >
                <div>
                  <h3 className="font-medium font-outfitRegular text-slate-700">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-outfitRegular">
                    Participants:{" "}
                    {group.participants && group.participants.length > 0
                      ? group.participants.map((participant) => participant.username).join(', ')
                      : ''}
                  </p>
                </div>
                <Link href={`/group-chat/${group._id}`}>
                  <button className="bg-violet-500 text-white px-4 py-2 rounded-xl font-outfitRegular hover:scale-[1.02] transition-all duration-300">
                    Open Chat
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
