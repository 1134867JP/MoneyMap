import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(180deg, #48c6ef 0%, #6f86d6 100%)',  // Fundo gradiente
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    height: 250,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6200ee',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  linkText: {
    color: '#6200ee',
    textAlign: 'right',
    marginBottom: 20,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(90deg, #48c6ef 0%, #6f86d6 100%)',  // Botão gradiente
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  categoryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
