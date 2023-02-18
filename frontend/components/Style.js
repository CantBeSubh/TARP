import styled from 'styled-components';
import { View, Text, Image } from 'react-native';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;
//colors
export const colors = {
    primary: '#ffffff',
    secondary: '#E5E7EB',
    tertiary: '#1F2937',
    darkLight: '#9CA3AF',
    brand: '#6D28D9',
    green: '#10B981',
    red: '#EF4444',
}

const { primary, secondary, tertiary, darkLight, brand, green, red } = colors;

export const StyledContainer = styled.view`
    flex: 1;
    padding: 25px;
    padding-top: ${Constants.statusBarHeight + 10}px;
    background-color: ${primary};
`;

export const InnerContainer = styled.view`
    flex: 1;
    width: 100%;
    align-items: center;
`;

export const PageLogo = styled.image`
    width: 250px;
    height: 200px;
`;

export const PageTitle = styled.text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;
`;