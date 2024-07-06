import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, Alert, Button } from 'react-native';
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
const MenuCell = ({ title, inStock, quantity, incrementQuantity, decrementQuantity, addToCart }) => (
  <Cell
    onPress={inStock ? addToCart : null}
    cellContentView={
      <View style={[styles.cellContentView, !inStock && styles.cellOutOfStock]}>
        <Text style={styles.menuItemText}>{title}</Text>
        {!inStock && <Text style={styles.outOfStockText}>Out of Stock</Text>}
      </View>
    }
    cellAccessoryView={
      <View style={styles.quantityContainer}>
        <Button title="-" onPress={decrementQuantity} disabled={!inStock || quantity === 0} />
        <Text style={styles.quantityText}>{quantity}</Text>
        <Button title="+" onPress={incrementQuantity} disabled={!inStock} />
      </View>
    }
  />
);

const CartButton = ({ cartItems }) => (
  <View style={styles.cartButton}>
    <Text style={styles.cartButtonText}>Cart: {cartItems.length}</Text>
  </View>
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

  const [menuItems, setMenuItems] = useState(items);
  const [cart, setCart] = useState([]);

  
  const incrementQuantity = (sectionIndex, itemIndex) => {
    const newMenuItems = [...menuItems];
    newMenuItems[sectionIndex].contents[itemIndex].quantity += 1;
    setMenuItems(newMenuItems);
  };

  const decrementQuantity = (sectionIndex, itemIndex) => {
    const newMenuItems = [...menuItems];
    if (newMenuItems[sectionIndex].contents[itemIndex].quantity > 0) {
      newMenuItems[sectionIndex].contents[itemIndex].quantity -= 1;
      setMenuItems(newMenuItems);
    }
  };

  const addToCart = (sectionIndex, itemIndex) => {
    const item = menuItems[sectionIndex].contents[itemIndex];
    if (item.quantity > 0) {
      setCart([...cart, item]);
      Alert.alert('Item Added', `${item.quantity} x ${item.title} has been added to the cart.`);
    } else {
      Alert.alert('Invalid Quantity', 'Please select a quantity greater than 0.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <CartButton cartItems={cart} />
      <ScrollView>
        <TableView>
          {menuItems.map((item, sectionIndex) => (
            <Section key={sectionIndex} header={item.title}>
              {item.contents.map((content, itemIndex) => (
                <MenuCell 
                  key={itemIndex} 
                  title={content.title}
                  inStock={content.inStock}
                  quantity={content.quantity}
                  incrementQuantity={() => incrementQuantity(sectionIndex, itemIndex)}
                  decrementQuantity={() => decrementQuantity(sectionIndex, itemIndex)}
                  addToCart={() => addToCart(sectionIndex, itemIndex)}
                 // action={() => handleMenuItemPress(content.title)}
                  />
              ))}
            </Section>
          ))}
        </TableView>
      </ScrollView>
    </SafeAreaView>
  );
}

  function HomeScreen({ navigation }) {
    const navigateToMenu = (menuItems) => {
      navigation.navigate('Menu', { items: menuItems });
    };

    const restaurants = [
      {
        name:"Joe's Gelato",
        tagline:"Desert, Ice cream, £££",
        eta:"10-30 mins",
        imgUri: require('./images/diner.jpg'),
        menu: [
          { title: 'Gelato', contents: [{ title: 'Vanilla', inStock: true}, { title: 'Chocolate', inStock: true  }, { title: 'Strawberry',  inStock: true, quantity: 0 }, { title: 'Mint Choc Chip',  inStock: true }] },
          { title: 'Sorbet', contents: [{ title: 'Lemon',  inStock: true }, { title: 'Mango',  inStock: true }, { title: 'Raspberry',  inStock: true}] },
          { title: 'Milkshake', contents: [{ title: 'Chocolate'}, { title: 'Strawberry',  inStock: true }, { title: 'Banana',  inStock: true}] },
        ]
      },

      {
        name: "Joe's Pasta",
        tagline: "Italian, Pasta, £££",
        eta: "50 mins",
        imgUri: require('./images/vanilla.jpg'),
        menu: [
          { title: 'Pasta', contents: [{ title: 'Spaghetti Bolognese',  inStock: true,  quantity: 0 }, { title: 'Carbonara',  inStock: true,  quantity: 0 }, { title: 'Pesto' }, { title: 'Lasagne' }] },
          { title: 'Pizza', contents: [{ title: 'Margherita',  inStock: true ,  quantity: 0}, { title: 'Pepperoni' }, { title: 'Vegetarian',  inStock: true,  quantity: 0}] },
          { title: 'Salad', contents: [{ title: 'Caesar',  inStock: true,  quantity: 0 }, { title: 'Greek' }, { title: 'Caprese',  inStock: true ,  quantity: 0}] },
        ]
      },
      {
        name: "Boost Smoothie",
        tagline: "Fitness Smoothies, £",
        eta: "45 mins",
        imgUri: require('./images/smoothie.jpg'),
        menu: [
          { title: 'Fruit Smoothies', contents: [{ title: 'Strawberry Banana',  inStock: true,  quantity: 0 }, { title: 'Mango Pineapple',  inStock: true,  quantity: 0}, { title: 'Berry Blast' }] },
          { title: 'Green Smoothies', contents: [{ title: 'Kale Spinach',  inStock: true,  quantity: 0 }, { title: 'Avocado',  inStock: true,  quantity: 0 }, { title: 'Cucumber Mint',  inStock: true }] },
          { title: 'Protein Smoothies', contents: [{ title: 'Chocolate Protein',  inStock: true,  quantity: 0}, { title: 'Peanut Butter' }, { title: 'Vanilla Whey',  inStock: true,  quantity: 0 }] },
        ]
      },
      {
        name: "Sushi Haven",
        tagline: "Japanese, Sushi, £££",
        eta: "30-50 mins",
        imgUri: require('./images/sushi.jpg'),
        menu: [
          { title: 'Sushi Rolls', contents: [{ title: 'California Roll',  inStock: true,  quantity: 0 }, { title: 'Spicy Tuna Roll',  inStock: true }, { title: 'Salmon Avocado Roll',  inStock: true }] },
          { title: 'Nigiri', contents: [{ title: 'Salmon Nigiri',  inStock: true,  quantity: 0}, { title: 'Tuna Nigiri',  inStock: true }, { title: 'Eel Nigiri' }] },
          { title: 'Sashimi', contents: [{ title: 'Salmon Sashimi',  inStock: true,  quantity: 0 }, { title: 'Tuna Sashimi',  quantity: 0 }, { title: 'Yellowtail Sashimi',  inStock: true,  quantity: 0 }] },
        ]
      },
      {
        name: "Burger Joint",
        tagline: "American, Burgers, ££",
        eta: "20-40 mins",
        imgUri: require('./images/burger.jpg'),
        menu: [
          { title: 'Burgers', contents: [{ title: 'Cheeseburger',inStock: true }, { title: 'Bacon Burger', inStock: true }, { title: 'Veggie Burger', inStock: true }] },
          { title: 'Fries', contents: [{ title: 'Regular Fries', inStock: true }, { title: 'Sweet Potato Fries', inStock: false }, { title: 'Cheese Fries', inStock: true }] },
          { title: 'Drinks', contents: [{ title: 'Coke', inStock: true }, { title: 'Sprite', inStock: true }, { title: 'Lemonade', inStock: true }] },
        ]
      },
      {
        name: "Curry House",
        tagline: "Indian, Curry, ££",
        eta: "40-60 mins",
        imgUri: require('./images/curry.jpg'),
        menu: [
          { title: 'Curries', contents: [{ title: 'Chicken Tikka Masala',  inStock: true,  quantity: 0}, { title: 'Lamb Vindaloo',  inStock: true }, { title: 'Paneer Butter Masala',  inStock: true,  quantity: 0}] },
          { title: 'Naan', contents: [{ title: 'Garlic Naan' ,  inStock: true,  quantity: 0}, { title: 'Cheese Naan',  inStock: true,  quantity: 0 }, { title: 'Plain Naan',  inStock: true,  quantity: 0 }] },
          { title: 'Sides', contents: [{ title: 'Samosa',  inStock: true,  quantity: 0 }, { title: 'Pakora' }, { title: 'Raita',  inStock: true,  quantity: 0 }] },
        ]
      },
      {
        name: "Taco Fiesta",
        tagline: "Mexican, Tacos, ££",
        eta: "25-45 mins",
        imgUri: require('./images/tacos.jpg'),
        menu: [
          { title: 'Tacos', contents: [{ title: 'Beef Taco',  inStock: true,  quantity: 0 }, { title: 'Chicken Taco',  inStock: true,  quantity: 0 }, { title: 'Fish Taco',  inStock: true,  quantity: 0 }] },
          { title: 'Quesadillas', contents: [{ title: 'Cheese Quesadilla',  inStock: true,  quantity: 0}, { title: 'Chicken Quesadilla',  inStock: true,  quantity: 0 }, { title: 'Beef Quesadilla',  inStock: true,  quantity: 0 }] },
          { title: 'Sides', contents: [{ title: 'Chips & Salsa',  inStock: true,  quantity: 0 }, { title: 'Guacamole',  inStock: true,  quantity: 0 }, { title: 'Corn',  inStock: true,  quantity: 0}] },
        ]
      }
    ];

    return (
      <SafeAreaView style={styles.container}>
          <ScrollView style={{height: '100%'}}>
            <TableView>
              <Section
                header = " "
                hideSeparator = {false}
                seperatorTintColor = "#ccc"
              >
                {restaurants.map((restaurant, index) => (
                  <HomeScreenCell
                    key={index}
                    title={restaurant.name}
                    tagline={restaurant.tagline}
                    eta={restaurant.eta}
                    imgUri={restaurant.imgUri}
                    action={() => navigateToMenu(restaurant.menu)}
                  />
                ))}
              </Section>
            </TableView>
          </ScrollView>
          <StatusBar style="auto" />
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
    menuItemText: {
      fontSize: 16,
    },
    cellOutOfStock: {
      opacity: 0.5,
    },
    outOfStockText: {
      color: 'red',
      fontSize: 12,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityText: {
      marginHorizontal: 5,
    },
    cartButton: {
      padding: 10,
      backgroundColor: '#ff5722',
      alignItems: 'center',
    },
    cartButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },

});
