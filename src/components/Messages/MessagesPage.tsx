import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockMessages, mockUsers, updateMessageReadStatus } from '../../data/mockData';
import { 
  MessageSquare, 
  Send, 
  Search,
  User,
  Circle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function MessagesPage() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Función para forzar re-render de componentes padre
  const forceUpdate = () => {
    setRefreshCounter(prev => prev + 1);
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent('messagesUpdated'));
  };

  // Simular mensajes en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular nuevos mensajes ocasionalmente
      if (Math.random() < 0.1) { // 10% de probabilidad cada 5 segundos
        const newMsg = {
          id: Date.now().toString(),
          fromId: selectedContact || '2',
          toId: user?.id || '1',
          content: '¡Hola! ¿Cómo va todo?',
          timestamp: new Date(),
          read: false
        };
        setMessages(prev => {
          const updated = [...prev, newMsg];
          // Actualizar también el array global
          mockMessages.push(newMsg);
          forceUpdate();
          return updated;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedContact, user?.id]);

  // Obtener conversaciones del usuario
  const userMessages = messages.filter(msg => 
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
      unreadCount,
      isOnline: Math.random() > 0.3 // Simular estado online
    };
  }).filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Ordenar por mensajes no leídos primero, luego por último mensaje
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    if (a.lastMessage && b.lastMessage) {
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    }
    return 0;
  });

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

  // Marcar mensajes como leídos cuando se selecciona una conversación
  useEffect(() => {
    if (selectedContact) {
      const messagesToMarkAsRead = messages.filter(msg => 
        msg.fromId === selectedContact && msg.toId === user?.id && !msg.read
      );

      if (messagesToMarkAsRead.length > 0) {
        // Actualizar estado local
        setMessages(prev => 
          prev.map(msg => 
            msg.fromId === selectedContact && msg.toId === user?.id && !msg.read
              ? { ...msg, read: true }
              : msg
          )
        );

        // Actualizar array global
        messagesToMarkAsRead.forEach(msg => {
          updateMessageReadStatus(msg.id, true);
        });

        // Forzar actualización de contadores
        forceUpdate();
      }
    }
  }, [selectedContact, user?.id]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newMessage.trim() || !selectedContact) return;
    
    const messageData = {
      id: Date.now().toString(),
      fromId: user?.id || '',
      toId: selectedContact,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => {
      const updated = [...prev, messageData];
      // Actualizar también el array global
      mockMessages.push(messageData);
      return updated;
    });
    setNewMessage('');

    // Simular indicador de escritura
    setTypingIndicator(selectedContact);
    setTimeout(() => {
      setTypingIndicator(null);
      // Simular respuesta automática ocasionalmente
      if (Math.random() < 0.3) {
        const responses = [
          '¡Perfecto! Gracias por la información.',
          'Entendido, nos vemos entonces.',
          'Excelente progreso, sigue así.',
          'De acuerdo, ajustaremos la rutina.',
          '¡Muy bien! ¿Cómo te sientes?'
        ];
        
        const autoResponse = {
          id: (Date.now() + 1).toString(),
          fromId: selectedContact,
          toId: user?.id || '',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(Date.now() + 2000),
          read: false
        };
        
        setTimeout(() => {
          setMessages(prev => {
            const updated = [...prev, autoResponse];
            // Actualizar también el array global
            mockMessages.push(autoResponse);
            forceUpdate();
            return updated;
          });
        }, 2000);
      }
    }, 1500);
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
    
    // Marcar mensajes como leídos inmediatamente
    const messagesToMarkAsRead = messages.filter(msg => 
      msg.fromId === contactId && msg.toId === user?.id && !msg.read
    );

    if (messagesToMarkAsRead.length > 0) {
      setMessages(prev => 
        prev.map(msg => 
          msg.fromId === contactId && msg.toId === user?.id && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );

      // Actualizar array global
      messagesToMarkAsRead.forEach(msg => {
        updateMessageReadStatus(msg.id, true);
      });

      // Forzar actualización de contadores
      forceUpdate();
    }
  };

  const getMessageStatus = (message: any) => {
    if (message.fromId !== user?.id) return null;
    
    return message.read ? (
      <CheckCircle2 className="w-3 h-3 text-blue-500" />
    ) : (
      <Circle className="w-3 h-3 text-gray-400" />
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              onClick={() => handleContactSelect(contact.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedContact === contact.id ? 'bg-blue-50 border-blue-200' : ''
              } ${contact.unreadCount > 0 ? 'bg-blue-25' : ''}`}
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
                  {/* Indicador de estado online */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    contact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${
                      contact.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {contact.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {contact.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {format(contact.lastMessage.timestamp, 'HH:mm', { locale: es })}
                        </span>
                      )}
                      {contact.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full min-w-[20px]">
                          {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs capitalize ${
                      contact.unreadCount > 0 ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {contact.role}
                    </p>
                    <div className="flex items-center space-x-1">
                      {contact.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-400">
                        {contact.isOnline ? 'En línea' : 'Desconectado'}
                      </span>
                    </div>
                  </div>
                  {contact.lastMessage && (
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${
                        contact.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {contact.lastMessage.fromId === user?.id && '✓ '}
                        {contact.lastMessage.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {contacts.length === 0 && (
            <div className="p-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay conversaciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron contactos' : 'Inicia una conversación'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Área de conversación */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header de conversación */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 relative">
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
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                      contacts.find(c => c.id === selectedContact)?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedContactInfo?.name}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize flex items-center space-x-2">
                      <span>{selectedContactInfo?.role}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        {contacts.find(c => c.id === selectedContact)?.isOnline ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600">En línea</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>Desconectado</span>
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {conversationMessages.length} mensajes
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
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    message.fromId === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {message.fromId !== user?.id && (
                      <div className="flex-shrink-0">
                        {selectedContactInfo?.avatar ? (
                          <img 
                            src={selectedContactInfo.avatar} 
                            alt={selectedContactInfo.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.fromId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-1 space-x-2 ${
                        message.fromId === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <p className={`text-xs ${
                          message.fromId === user?.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}>
                          {format(message.timestamp, 'HH:mm', { locale: es })}
                        </p>
                        {getMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Indicador de escritura */}
              {typingIndicator === selectedContact && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 bg-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">escribiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input de mensaje */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escribe tu mensaje..."
                  disabled={!contacts.find(c => c.id === selectedContact)?.isOnline}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !contacts.find(c => c.id === selectedContact)?.isOnline}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
              
              {!contacts.find(c => c.id === selectedContact)?.isOnline && (
                <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Este usuario está desconectado. Tu mensaje se entregará cuando esté en línea.</span>
                </p>
              )}
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