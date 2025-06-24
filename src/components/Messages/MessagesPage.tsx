import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockMessages, mockUsers } from '../../data/mockData';
import { 
  MessageSquare, 
  Send, 
  Search,
  User,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function MessagesPage() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener conversaciones del usuario
  const userMessages = mockMessages.filter(msg => 
    msg.fromId === user?.id || msg.toId === user?.id
  );

  // Obtener lista de contactos únicos
  const contactIds = Array.from(new Set(
    userMessages.map(msg => msg.fromId === user?.id ? msg.toId : msg.fromId)
  ));

  const contacts = contactIds.map(contactId => {
    const contact = mockUsers.find(u => u.id === contactId);
    const lastMessage = userMessages
      .filter(msg => msg.fromId === contactId || msg.toId === contactId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    const unreadCount = userMessages.filter(msg => 
      msg.fromId === contactId && msg.toId === user?.id && !msg.read
    ).length;

    return {
      ...contact!,
      lastMessage,
      unreadCount
    };
  }).filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener mensajes de la conversación seleccionada
  const conversationMessages = selectedContact 
    ? userMessages
        .filter(msg => 
          (msg.fromId === user?.id && msg.toId === selectedContact) ||
          (msg.fromId === selectedContact && msg.toId === user?.id)
        )
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : [];

  const selectedContactInfo = mockUsers.find(u => u.id === selectedContact);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    // Aquí se enviaría el mensaje
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Lista de contactos */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900 mb-3">Mensajes</h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedContact === contact.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 relative">
                  {contact.avatar ? (
                    <img 
                      src={contact.avatar} 
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
                  {contact.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {contact.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de conversación */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header de conversación */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {selectedContactInfo?.avatar ? (
                    <img 
                      src={selectedContactInfo.avatar} 
                      alt={selectedContactInfo.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedContactInfo?.name}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedContactInfo?.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.fromId === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.fromId === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.fromId === user?.id
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {format(message.timestamp, 'HH:mm', { locale: es })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escribe tu mensaje..."
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Selecciona una conversación
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Elige un contacto para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}