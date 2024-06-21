import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

const Stack = createStackNavigator();
const HomeScreenCell = ({ title, tagline, eta, imgUri, action }) => (
  <Cell
  onPress={action}
  cellContentView={
    <View style={styles.cellContentView}>
      <Image 
        source={imgUri} style={styles.headerImage}
      />
      <View style={styles.etaContainer}>
        <Text style={styles.etaText}>{eta}</Text>
      </View>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.taglineText}>{tagline}</Text>
    </View>
  }
/>
);



export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

  function MenuScreen({ route }) { 
    const { items } = route.params;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <TableView>
            {items.map((item, index) => (
              <Section key={index} header={item.title}>
                {item.contents.map((content, idx) => (
                  <Cell 
                    key={idx} 
                    title={content.title}
                    onPress={() => navigation.navigate('ItemDetails', { itemId: content.id })}
                    />
                ))}
              </Section>
            ))}
          </TableView>
        </ScrollView>
      </SafeAreaView>
    )
  }
  
  function HomeScreen({ navigation }) {
    const navigateToMenu = () => {
      navigation.navigate('Menu', {
        items: [
          {
            title: 'Gelato',
            contents: [
              { title: 'Vanilla'},
              { title: 'Chocolate'},
              { title: 'Strawberry'},
              { title: 'Mint Choc Chip'}
            ],
       
          },
          {
            title: 'Pasta',
            contents: [
              { title: 'Spaghetti Bolognese'},
              { title: 'Carbonara'},
              { title: 'Pesto'},
              { title: 'Lasagne'}
            ],
          },
        ],
      });
    };

    return (
      <SafeAreaView style={styles.container}>
          <ScrollView style={{height: '100%'}}>
            <TableView>
              <Section
                header = " "
                hideSeparator = {false}
                seperatorTintColor = "#ccc"
              >
                <HomeScreenCell
                  title="Joe's Gelato"
                  tagline="Desert, Ice cream, £££"
                  eta="10-30 mins"
                  imgUri={require('./images/diner.jpg')}
                  action= {navigateToMenu}
                />

                <HomeScreenCell
                  title="Joe's Pasta"
                  tagline="Italian, Pasta, £££"
                  eta="50 mins"
                  imgUri={require('./images/vanilla.jpg')}
                  action= {navigateToMenu}
                />
              </Section>
            </TableView>
          </ScrollView>
      </SafeAreaView>
    );
  }
// note to self but now i need to use one shop -> one menu, seperate the item specifically for one shop 
// find photos for each shop

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0'
    },
    cellContentView: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: 160,
      borderRadius: 8,
    },
    etaContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: '#ccc',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    etaText: {
      fontSize: 12,
      color: '#333',
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 12,
    },
    taglineText: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
});
