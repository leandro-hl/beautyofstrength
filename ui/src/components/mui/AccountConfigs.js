import {
    List,
    ListItem,
    Divider,
    ListItemText,
    ListSubheader,
    Paper,
    Switch,
    TextField,
    Box,
    Typography, IconButton
} from "@mui/material";
import {Component} from "react";
import {setTheme} from "../../functions";
import {AppContext, setData, showSuccess} from "../../context";
import {LeftTypography, ListItemJustifyBetween, MuiIcon, RightTypography, TextFieldCentered} from "./customizations";
import {TooltipInfoButton} from "./TooltipInfoButton";
import {ReactComponent as SaveIcon} from "../../icons/save.svg";
import {saveProfileConfiguration} from "../../service";

export class AccountConfigs extends Component {
    static contextType = AppContext
    state = {checked: [], config: {}, dirty: false}

    constructor(props) {
        super(props);
        this.state = {
            checked: [],
            config: {
                forceMin: props.userAccount.force_min,
                forceMax: props.userAccount.force_max,
                hypertrophyMin: props.userAccount.hypertrophy_min,
                hypertrophyMax: props.userAccount.hypertrophy_max,
                resistenceMin: props.userAccount.resistence_min,
                resistenceMax: props.userAccount.resistence_max,
            },
            dirty: false
        }
    }

    changeTheme() {
        const {state: {darkTheme}} = this.context
        const newChoice = !darkTheme
        localStorage.setItem('darkTheme', newChoice.toString())
        setTheme(newChoice)
        this.context.dispatch(setData({darkTheme: newChoice}))
    }

    handleToggle = (value) => () => {
        const {checked} = this.state
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({checked: newChecked});
    };

    renderItem(text, min,max, name) {
        const {config} = this.state
        return (
            <ListItemJustifyBetween>
                <Box>
                    {text}<TooltipInfoButton title={'Obten el ultimo peso y repeticiones efectivas para cada rango'}/>
                </Box>
                <Box>
                    <TextFieldCentered
                        name={name}
                        value={config[name+'Min']}
                        type={'number'}
                        onChange={(e) => this.setState({dirty:true, config: {...config, [name+'Min']: e.target.value}})}
                        className={'size-two-digits'}
                        placeholder={min}
                        variant="standard" />
                    A
                    <TextFieldCentered
                        name={name}
                        value={config[name+'Max']}
                        type={'number'}
                        onChange={(e) => this.setState({dirty:true, config: {...config, [name+'Max']: e.target.value}})}
                        className={'size-two-digits'}
                        placeholder={max}
                        variant="standard" />
                </Box>
            </ListItemJustifyBetween>
        );
    }

    async saveConfig() {
        try{
            const {config} = this.state
            console.log(this.state.config)
            await saveProfileConfiguration({
                forceMin: parseInt(config.forceMin,10),
                forceMax: parseInt(config.forceMax,10),
                hypertrophyMin: parseInt(config.hypertrophyMin,10),
                hypertrophyMax: parseInt(config.hypertrophyMax,10),
                resistenceMin: parseInt(config.resistenceMin,10),
                resistenceMax: parseInt(config.resistenceMax,10),
                saveRoutineWithLatestWeightAvailable: config.saveRoutineWithLatestWeightAvailable
            })
            this.setState({dirty:false})
            showSuccess(this.context, '', 'Configuracion guardada con exito!')
        } catch (e) {

        }
    }

    render() {
        const {dirty, config} = this.state
        const {state: {darkTheme}} = this.context

        return (
            <Paper>
                <List
                    subheader={
                        <ListSubheader>
                            Configuracion
                            {
                                dirty &&
                                <IconButton aria-label="save" onClick={() => this.saveConfig()}>
                                    <SaveIcon />
                                </IconButton>
                            }
                        </ListSubheader>}
                >
                    {this.renderItem('Rango de Fuerza',1,6, 'force')}
                    <Divider  component="li" />
                    {this.renderItem('Rango de Hipertrofia',7,12, 'hypertrophy')}
                    <Divider  component="li" />
                    {this.renderItem('Rango de Resistencia',13,50, 'resistence')}
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText  primary="Guardar Rutina Con Ultimo Peso Disponible" />
                        <TooltipInfoButton title={'Si ya tenes un peso de referencia cargado en la app para el rango de entrenamiento correspondiente, la serie se guarda con ese peso al ejecutar la rutina sin cambios'}/>
                        <Switch checked={config.saveRoutineWithLatestWeightAvailable} onChange={(e) => this.setState({dirty:true, config: {...config, saveRoutineWithLatestWeightAvailable: !config.saveRoutineWithLatestWeightAvailable}})}/>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText  primary="Tema Oscuro" />
                        <Switch checked={darkTheme} onChange={() => this.changeTheme()} />
                    </ListItem>
                </List>
            </Paper>
        )
    }
}