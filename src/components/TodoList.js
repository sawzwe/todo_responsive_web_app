import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { IconButton, Grid } from '@mui/material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { Button } from '@mui/material';

import DeleteDialog from './DeleteDialog';
import UpdateDialog from './UpdateDialog';
import CreateDialog from './CreateDialog';

// // Define the hover animation CSS class
const HoverCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.04)',
  },
  display: 'flex',
  justifyContent: 'space-between',
}));


const TodoList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenCreate, setDialogOpenCreate] = useState(false);
  const [dialogOpenUpdate, setDialogOpenUpdate] = useState(false);
  const [dialogOpenDelete, setDialogOpenDelete] = useState(false);


  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);

  const handleDeleteClick = (taskId) => {
    // setDialogOpen(true);
    setDialogOpenDelete(true);
    setTaskIdToDelete(taskId);
    // console.log(taskId);
  };

  const handleUpdateClick = (taskId) => {
    // setDialogOpen(true);
    setDialogOpenUpdate(true);
    setTaskIdToUpdate(taskId);
    // console.log(taskId);
  };

  const handleDeleteDialogClose = () => {
    // setDialogOpen(false);
    setDialogOpenDelete(false)
    setTaskIdToDelete(null);
  };

  const handleUpdateDialogClose = () => {
    // setDialogOpen(false);
    setDialogOpenUpdate(false);
    setTaskIdToUpdate(null);
  };

  const handleCreateClick = () => {
    // setDialogOpen(true);
    setDialogOpenCreate(true)
  };

  const handleCreateDialogClose = () => {
    // setDialogOpen(false);
    setDialogOpenCreate(false)
  };

  useEffect(() => {
    axios
      .get('/api/todoList')
      .then((response) => {
        // Filter completed tasks (where t.completed === false)
        const completedTasks = response.data.filter((t) => t.completed === false);
        setList(completedTasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleComplete = (taskId) => {
    axios
      .put("/api/todoList", {
        id: taskId,
        completed: true, // Set the completed status to true to mark the task as completed
      })
      .then((response) => {
        if (response.data) {
          // Successful request
          // Update the list state with the updated task
          const updatedList = list.map((t) =>
            t._id === taskId ? { ...t, completed: true } : t
          );
          setList(updatedList);
        } else {
          throw new Error("Update failed");
        }
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };


  if (loading) {
    return (
      // Center the loading gif inside the paper using Grid
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', height: '85vh' }}
      >
        <Grid item>
          <img src="/loading.gif" alt="Loading..." />
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >

        <Paper elevation={0} variant="outlined" style={{ width: '100%', height: '100%', paddingTop: '20px' }}>
          {list && list.length > 0 ? (
            list.map((t, index) => (
              (
                <HoverCard
                  key={t._id}
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    width: '-80%',
                    justifyContent: 'left',
                    alignItems: 'center',
                    my: index === 0 ? 0 : 2, // Adds margin only to cards except the first one
                    mx: 4,
                  }}
                >
                  <CardActions sx={{ flex: '0 0 5%' }}>
                    <Checkbox
                      checked={t.completed}
                      onChange={() => handleComplete(t._id)} // Complete a task
                    />
                  </CardActions>


                  <CardContent sx={{ flex: '0 0 90%' }}>
                    <Typography variant="h6" component="div">
                      {t.title}
                    </Typography>
                    <Typography variant="subtitle2" component="div" sx={{ opacity: 0.7 }}>
                      [Created On] {t.createdAt.split('T')[0]}
                    </Typography>
                  </CardContent>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: '0 0 5%' }}>
                    <IconButton size="large" color="inherit" sx={{ opacity: 0.7 }} onClick={() => handleUpdateClick(t._id)}>
                      <BorderColorRoundedIcon fontSize='small' />
                    </IconButton>

                    <IconButton size="large" color="inherit" sx={{ opacity: 0.7 }} onClick={() => handleDeleteClick(t._id)}>
                      <DeleteOutlineRoundedIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </HoverCard>
              )
            ))
          ) : (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              height="85%"
            >
              <HoverCard
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  height: '25%',
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div" sx={{ opacity: 0.7, padding: '10px' }}>
                    No Task
                  </Typography>
                </CardContent>
                <Button
                  variant='outlined'
                  size='large'
                  color='primary'
                  sx={{
                    background: '#000000', // Change the background color
                    boxShadow: '0px 4px 8px rgba(#757ce8, 0.2)', // Add a button shadow
                  }}
                  onClick={() => handleCreateClick()}
                >
                  Create +
                </Button>
              </HoverCard>
            </Grid>

          )}
        </Paper>

      </Box >

      {dialogOpenDelete && taskIdToDelete && (
        <DeleteDialog taskId={taskIdToDelete} onOpen={dialogOpenDelete} onClose={handleDeleteDialogClose} />
      )}

      {dialogOpenUpdate && taskIdToUpdate && (
        <UpdateDialog taskId={taskIdToUpdate} onOpen={dialogOpenUpdate} onClose={handleUpdateDialogClose} />
      )}

      {dialogOpenCreate && (
        <CreateDialog type="Create" onOpen={dialogOpenCreate} onClose={handleCreateDialogClose} />
      )}
    </>
  );
};

export default TodoList;

