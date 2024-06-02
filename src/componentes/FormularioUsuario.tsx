import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export const FormularioUsuario: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [token, setToken] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        // Função para obter o token de autenticação
        const fetchToken = async () => {
            try {
                const response = await axios.post('http://10.0.2.2:8000/api/token', {
                    username: "joaozin_do_grau",
                    password: 123
                }); 
                const token = response.data.access;
                console.log(token)
                setToken(token);
            } catch (error) {
                console.error('Erro ao obter token:', error);
            }
        };

        // Chama a função para obter o token quando o componente é montado
        fetchToken();
    }, []);

    const fazerCadastro = async () => {
        try {
            // Verificar se o token está disponível
            if (!token) {
                console.error('Token não disponível');
                return;
            }

            // Fazer a requisição de cadastro usando o token no header
            const response = await axios.post('http://10.0.2.2:8000/api/create_user', 
                {
                    username: usuario,
                    password: senha
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Se o cadastro for bem-sucedido, navegar para a tela inicial
            navigation.navigate('rotasTab');
        } catch (error) {
            // Se houver um erro no cadastro, você pode exibir uma mensagem de erro
            console.error('Erro de cadastro:', error);
        }
    };

    return (
        <View style={estilos.conteiner}>
            <View style={estilos.conteinerCampos}>
                <TextInput
                    style={estilos.campo}
                    placeholder="Usuário"
                    placeholderTextColor="#01233c"
                    keyboardType="default"
                    onChangeText={setUsuario}
                    value={usuario}
                />
                <TextInput
                    style={estilos.campo}
                    placeholder="Senha"
                    placeholderTextColor="#01233c"
                    secureTextEntry={true}
                    onChangeText={setSenha}
                    value={senha}
                />
            </View>
            <TouchableOpacity style={estilos.botao} onPress={fazerCadastro}>
                <Feather name="user-plus" size={24} color="#dee2e6" />
            </TouchableOpacity>
        </View>
    );
};

const estilos = StyleSheet.create({
    conteiner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 10,
    },
    conteinerCampos: {
        flex: 1,
    },
    campo: {
        height: 50,
        backgroundColor: '#dee2e6',
        color: '#01233c',
        marginVertical: 5,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    botao: {
        width: 60,
        height: 290,
        marginStart: 10,
        backgroundColor: '#4f030a',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});
