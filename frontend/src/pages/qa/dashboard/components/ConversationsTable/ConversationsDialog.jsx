import { List, Dialog, ListItem, DialogTitle, ListItemText, DialogContent } from '@mui/material';

const ConversationsDialog = ({ open, onClose, conversation }) => {

  const formatMessages = (messages, agentName, customerName) => {
    if (!messages || messages.length === 0) return [];
   
    return messages.map(msg => {
      const formattedMessage = msg.message.replaceAll("Agente:",agentName)
        .replaceAll("Cliente:",customerName);
  
      return { ...msg, message: formattedMessage };
    });
  };
  if(conversation?.messages?.length){
    conversation.messages = formatMessages(conversation.messages, conversation.agentName, conversation.customerName)
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Conversación</DialogTitle>
      <DialogContent>
        <List>
          {conversation?.messages
            ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((msg) => (
              <ListItem key={msg.id}>
                <ListItemText primary={msg.message} secondary={new Date(msg.createdAt).toLocaleString()} />
              </ListItem>
            ))}
        </List>
      </DialogContent>
    </Dialog>
  )
};

export default ConversationsDialog;
