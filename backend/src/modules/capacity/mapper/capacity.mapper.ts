import { EventAccess } from "../entities/event-access.entity";

interface Results {
    eventos: EventAccess[],
    aforoPorSede?: any[],
}

export class CapacityMapper {

    static toCapacityInfo(events: EventAccess[], isHistoric: boolean) {
        const locationsList : any[] = []
        if (!isHistoric) {
            const locations = events.map((event) => event.sede)
            .filter((value, index, self) => self.findIndex(location => value.id === location.id) === index);
            for (const location of locations) {
                const locEvents = events.filter((event) => event.sede.id === location.id);
                const totalLocIns = locEvents.filter((event) => event.tipo === 'INGRESO').length
                const totalLocOuts = locEvents.filter((event) => event.tipo === 'SALIDA').length
                locationsList.push({
                    sede: location,
                    totalIngresos: totalLocIns,
                    totalSalidas: totalLocOuts,
                    aforo: totalLocIns - totalLocOuts //TODO: es fiable?
                });
            }
        }
        return {
            eventos: events,
            aforoPorSede: locationsList
        }
    }

    static toCapacityFilteredByLocation(events: Results, locationId: string) {
        const eventsFiltered = events.eventos.filter(ev => ev.locationId === locationId);
        return this.toCapacityInfo(eventsFiltered, false);
    }
}