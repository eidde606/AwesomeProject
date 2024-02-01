import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, View } from "react-native";
import GoalInput from "./components/GoalInput";
import GoalItem from "./components/GoalItem";

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [lifeGoals, setLifeGoals] = useState([]);

  // Fetch goals from the server on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  // Function to fetch goals from the server
  const fetchGoals = async () => {
    try {
      const response = await axios.get(
        "https://lifegoals-eb3650612eef.herokuapp.com/api/goals"
      );
      const goalsWithIds = response.data.map((goal) => ({
        ...goal,
        _id: goal._id.toString(),
      }));
      setLifeGoals(goalsWithIds);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  function startAddGoalHandler() {
    setModalIsVisible(true);
  }

  function endAddGoalHandler() {
    setModalIsVisible(false);
  }

  // Function to add a new goal
  const addGoalHandler = async (enteredGoalText) => {
    try {
      const response = await axios.post(
        "https://lifegoals-eb3650612eef.herokuapp.com/api/goals",
        {
          text: enteredGoalText,
        }
      );
      const newGoal = { ...response.data, _id: response.data._id.toString() };
      setLifeGoals((currentLifeGoals) => [...currentLifeGoals, newGoal]);
      endAddGoalHandler();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  // Function to delete a goal
  const deleteGoalHandler = async (id) => {
    console.log("Deleting goal with id:", id);
    try {
      await axios.delete(
        `https://lifegoals-eb3650612eef.herokuapp.com/api/goals/${id}`
      );
      setLifeGoals((currentLifeGoals) =>
        currentLifeGoals.filter((goal) => goal._id !== id)
      );
    } catch (error) {
      console.error(
        "Error deleting goal:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.appContainer}>
        <Button
          title="Add New Goal"
          color="#a065ec"
          onPress={startAddGoalHandler}
        />
        <GoalInput
          visible={modalIsVisible}
          onAddGoal={addGoalHandler}
          onCancel={endAddGoalHandler}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            data={lifeGoals}
            renderItem={(itemData) => (
              <GoalItem
                text={itemData.item.text}
                id={itemData.item._id} // Use '_id' instead of 'id'
                onDeleteItem={deleteGoalHandler}
              />
            )}
            keyExtractor={(item) => item._id.toString()} // Use '_id' instead of 'id'
            alwaysBounceVertical={false}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  goalsContainer: {
    flex: 5,
  },
});
