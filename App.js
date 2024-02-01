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
      const response = await axios.get("http://localhost:5001/api/goals");
      setLifeGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  function startAddGoalHandler(params) {
    setModalIsVisible(true);
  }

  function endAddGoalHandler(params) {
    setModalIsVisible(false);
  }

  // Function to add a new goal
  const addGoalHandler = async (enteredGoalText) => {
    try {
      const response = await axios.post("http://localhost:5001/api/goals", {
        text: enteredGoalText,
      });
      setLifeGoals((currentLifeGoals) => [...currentLifeGoals, response.data]);
      endAddGoalHandler();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  function deleteGoalHandler(id) {
    setLifeGoals((currentLifeGoals) => {
      return currentLifeGoals.filter((goal) => goal.id !== id);
    });
  }

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
            renderItem={(itemData) => {
              return (
                <GoalItem
                  text={itemData.item.text}
                  id={itemData.item.id}
                  onDeleteItem={deleteGoalHandler}
                  key={itemData.item.id}
                />
              );
            }}
            keyExtractor={(item) => item.id}
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
