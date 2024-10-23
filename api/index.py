import json
from flask import Flask, request
import numpy as np
from scipy.special import softmax
import random
app = Flask(__name__)

facilitators = [
    'Lock', 'Glen', 'Banks', 'Richards', 'Shaw', 'Singer', 'Uther', 'Tyler', 'Numen', 'Zeldin'
]

roomCapacities = {
    "Slater 003": 45,
    "Roman 216": 30,
    "Loft 206": 75,
    "Roman 201": 50,
    "Loft 310": 108,
    "Beach 201": 60,
    "Beach 301": 75,
    "Logos 325": 450,
    "Frank 119": 60
}

activities = [
    {
        "name": "SLA101A",
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"]
    },
    {
        "name": "SLA101B",
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"],
    },
    {
        "name": "SLA191A",
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"],
    },
    {
        "name": "SLA191B",
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"],
    },
    {
        "name": "SLA201",
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Banks", "Zeldin", "Shaw"],
        "other_facilitators": ["Numen", "Richards", "Singer"],
    },
    {
        "name": "SLA291",
        "enrollment": 50,
        "preferred_facilitators": ["Lock", "Banks", "Zeldin", "Singer"],
        "other_facilitators": ["Numen", "Richards", "Shaw", "Tyler"],
    },
    {
        "name": "SLA303",
        "enrollment": 60,
        "preferred_facilitators": ["Glen", "Zeldin", "Banks"],
        "other_facilitators": ["Numen", "Singer", "Shaw"],
    },
    {
        "name": "SLA304",
        "enrollment": 25,
        "preferred_facilitators": ["Glen", "Banks", "Tyler"],
        "other_facilitators": ["Numen", "Singer", "Shaw", "Richards", "Uther", "Zeldin"],
    },
    {
        "name": "SLA394",
        "enrollment": 20,
        "preferred_facilitators": ["Tyler", "Singer"],
        "other_facilitators": ["Richards", "Zeldin"],
    },
    {
        "name": "SLA449",
        "enrollment": 60,
        "preferred_facilitators": ["Tyler", "Singer", "Shaw"],
        "other_facilitators": ["Zeldin", "Uther"],
    },
    {
        "name": "SLA451",
        "enrollment": 100,
        "preferred_facilitators": ["Tyler", "Singer", "Shaw"],
        "other_facilitators": ["Zeldin", "Uther", "Richards", "Banks"],
    },
]

activitiesByName = {
    "SLA101A": {
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"]
    },
    "SLA101B": {
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"],
    },
    "SLA191A": {
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"],
    },
    "SLA191B": {
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Lock", "Banks", "Zeldin"],
        "other_facilitators": ["Numen", "Richards"],
    },
    "SLA201": {
        "enrollment": 50,
        "preferred_facilitators": ["Glen", "Banks", "Zeldin", "Shaw"],
        "other_facilitators": ["Numen", "Richards", "Singer"],
    },
    "SLA291": {
        "enrollment": 50,
        "preferred_facilitators": ["Lock", "Banks", "Zeldin", "Singer"],
        "other_facilitators": ["Numen", "Richards", "Shaw", "Tyler"],
    },
    "SLA303": {
        "enrollment": 60,
        "preferred_facilitators": ["Glen", "Zeldin", "Banks"],
        "other_facilitators": ["Numen", "Singer", "Shaw"],
    },
    "SLA304": {
        "enrollment": 25,
        "preferred_facilitators": ["Glen", "Banks", "Tyler"],
        "other_facilitators": ["Numen", "Singer", "Shaw", "Richards", "Uther", "Zeldin"],
    },
    "SLA394": {
        "enrollment": 20,
        "preferred_facilitators": ["Tyler", "Singer"],
        "other_facilitators": ["Richards", "Zeldin"],
    },
    "SLA449": {
        "enrollment": 60,
        "preferred_facilitators": ["Tyler", "Singer", "Shaw"],
        "other_facilitators": ["Zeldin", "Uther"],
    },
    "SLA451": {
        "enrollment": 100,
        "preferred_facilitators": ["Tyler", "Singer", "Shaw"],
        "other_facilitators": ["Zeldin", "Uther", "Richards", "Banks"],
    },
}

times = [
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
]

class FitnessRules:
    @staticmethod
    def _is_consecutive(a, b):
        """Returns true if the two times are consecutive."""
        return (
            times.index(a) + 1 == times.index(b)
            or times.index(a) - 1 == times.index(b)
        )

    @staticmethod
    def _is_separated_by_one_hour(a, b):
        """Returns true if there is an hour in between the two times."""
        return (
            times.index(a) + 2 == times.index(b)
            or times.index(a) - 2 == times.index(b)
        )

    @staticmethod
    def _is_four_hours_apart(a, b):
        """
        Returns True if the two times are separated by 4 hours.
        (e.g. 10 AM and 2 PM)
        """
        return (
            times.index(a) + 4 == times.index(b)
            or times.index(a) - 4 == times.index(b)
        )
    
    @staticmethod
    def _one_in_far_building(a, b):
        """
        Returns True if one of the rooms is in Roman or Beach and the other isn't.
        """
        return (
            (a in ["Roman 216", "Beach 201"] and b not in ["Roman 216", "Beach 201"])
            or (b in ["Roman 216", "Beach 201"] and a not in ["Roman 216", "Beach 201"])
        )

    # Activity is scheduled at the same time in the same room as another of the activities: -0.5
    @staticmethod
    def schedule_conflict(new_assignment, existing_assignments):
        for assignment in existing_assignments:
            if assignment["time"] == new_assignment["time"] and assignment["room"] == new_assignment["room"]:
                return -0.5
        return 0

    # Activities is in a room too small for its expected enrollment: -0.5
    # Activities is in a room with capacity > 3 times expected enrollment: -0.2
    # Activities is in a room with capacity > 6 times expected enrollment: -0.4
    # Otherwise + 0.3
    @staticmethod
    def room_size(new_assignment, existing_assignments):
        assigned_room_capacity = roomCapacities[new_assignment["room"]]
        expected_enrollment = new_assignment["enrollment"]
        if assigned_room_capacity < expected_enrollment:
            return -0.5
        elif assigned_room_capacity > 6 * expected_enrollment:
            return -0.4
        elif assigned_room_capacity > 3 * expected_enrollment:
            return -0.2
        else:
            return 0.3

    # Activities is overseen by a preferred facilitator: + 0.5
    # Activities is overseen by another facilitator listed for that activity: +0.2
    # Activities is overseen by some other facilitator: -0.1
    @staticmethod
    def facilitator_preference(new_assignment, existing_assignments):
        new_assignment_facilitator = new_assignment["facilitator"]
        new_assignment_activity = new_assignment["activity"]
        activityReference = activitiesByName[new_assignment_activity]
        if new_assignment_facilitator in activityReference["preferred_facilitators"]:
            return 0.5
        elif new_assignment_facilitator in activityReference["other_facilitators"]:
            return 0.2
        else:
            return -0.1

    # Activity facilitator is scheduled for only 1 activity in this time slot: + 0.2
    # Activity facilitator is scheduled for more than one activity at the same time: - 0.2
    @staticmethod
    def facilitator_concurrent_load(new_assignment, existing_assignments):
        facilitator = new_assignment["facilitator"]
        time = new_assignment["time"]
        count = 0
        for assignment in existing_assignments:
            if assignment["facilitator"] == facilitator and assignment["time"] == time:
                count += 1
        if count == 0:
            return 0.2
        else:
            return -0.2

    # Facilitator is scheduled to oversee more than 4 activities total: -0.5
    # Facilitator is scheduled to oversee 1 or 2 activities*: -0.4
    # Exception: Dr. Tyler is committee chair and has other demands on his time.
    # No penalty if he’s only required to oversee < 2 activities.
    @staticmethod
    def facilitator_total_load(new_assignment, existing_assignments):
        facilitator = new_assignment["facilitator"]
        count = 1
        for assignment in existing_assignments:
            if assignment["facilitator"] == facilitator:
                count += 1
        if facilitator == "Tyler" and count < 2:
            return 0
        elif count > 4:
            return -0.5
        elif count <= 2:
            return -0.4
        else:
            return 0

    # If any facilitator scheduled for consecutive time slots: Same rules as for SLA 191 and SLA 101 in consecutive time slots—see below.
    # A section of SLA 191 and a section of SLA 101 are overseen in consecutive time slots (e.g., 10 AM & 11 AM): +0.5
    # In this case only (consecutive time slots), one of the activities is in Roman or Beach, and the other isn’t: -0.4
    # It’s fine if neither is in one of those buildings, of activity; we just want to avoid having consecutive activities being widely separated.
    @staticmethod
    def facilitator_consecutive_time_slots(new_assignment, existing_assignments):
        for assignment in existing_assignments:
            if assignment["facilitator"] == new_assignment["facilitator"]:
                if FitnessRules._is_consecutive(assignment["time"], new_assignment["time"]):
                    if FitnessRules._one_in_far_building(assignment["room"], new_assignment["room"]):
                        return -0.4
                    else:
                        return 0.5
        return 0

    # The 2 sections of SLA 101 are more than 4 hours apart: + 0.5
    # Both sections of SLA 101 are in the same time slot: -0.5
    # The 2 sections of SLA 191 are more than 4 hours apart: + 0.5
    # Both sections of SLA 191 are in the same time slot: -0.5
    @staticmethod
    def activity_specific_adjustments_sla(new_assignment, existing_assignments):
        new_activity = new_assignment["activity"]
        new_assignment_is_101 = new_activity.startswith("SLA191")
        new_assignment_is_191 = new_activity.startswith("SLA101")
        if new_assignment_is_101 or new_assignment_is_191:
            for assignment in existing_assignments:
                if (
                    (new_assignment_is_101 and assignment["activity"].startswith("SLA101")) or
                    (new_assignment_is_191 and assignment["activity"].startswith("SLA191"))
                ):
                    if FitnessRules._is_four_hours_apart(assignment["time"], new_assignment["time"]):
                        return 0.5
                    elif assignment["time"] == new_assignment["time"]:
                        return -0.5
        return 0

    # A section of SLA 191 and a section of SLA 101 are overseen in consecutive time slots (e.g., 10 AM & 11 AM): +0.5
    # In this case only (consecutive time slots), one of the activities is in Roman or Beach, and the other isn’t: -0.4
    # It’s fine if neither is in one of those buildings, of activity; we just want to avoid having consecutive activities being widely separated.
    @staticmethod
    def activity_specific_adjustments_sla_191_and_sla_101(new_assignment, existing_assignments):
        new_assignment_activity = new_assignment["activity"]
        new_assignment_is_101 = new_assignment_activity.startswith("SLA191")
        new_assignment_is_191 = new_assignment_activity.startswith("SLA101")
        if new_assignment_is_101 or new_assignment_is_191:
            for assignment in existing_assignments:
                current_activity = assignment["activity"]
                if (
                    (current_activity.startswith("SLA101") and new_assignment_is_191) or
                    (current_activity.startswith("SLA191") and new_assignment_is_101)
                ):
                    if FitnessRules._is_consecutive(assignment["time"], new_assignment["time"]):
                        if current_activity != new_assignment_activity:
                            if (FitnessRules._one_in_far_building(assignment["room"], new_assignment["room"])):
                                return -0.4
                            else:
                                return 0.5
        return 0

    #  A section of SLA 191 and a section of SLA 101 are taught separated by 1 hour (e.g., 10 AM & 12:00 Noon): + 0.25
    #  A section of SLA 191 and a section of SLA 101 are taught in the same time slot: -0.25
    @staticmethod
    def activity_specific_adjustments_sla_191_and_sla_101_separated_by_1_hour(new_assignment, existing_assignments):
        new_assignment_activity = new_assignment["activity"]
        new_assignment_is_101 = new_assignment_activity.startswith("SLA191")
        new_assignment_is_191 = new_assignment_activity.startswith("SLA101")
        if new_assignment_is_101 or new_assignment_is_191:
            for assignment in existing_assignments:
                current_activity = assignment["activity"]
                current_is_101 = current_activity.startswith("SLA101")
                current_is_191 = current_activity.startswith("SLA191")
                if (current_is_101 and new_assignment_is_191) or (current_is_191 and new_assignment_is_101):
                    if FitnessRules._is_separated_by_one_hour(assignment["time"], new_assignment["time"]):
                        return 0.25
                    elif assignment["time"] == new_assignment["time"]:
                        return -0.25
                # TODO: should this break after the first match?
        return 0

def get_fitness(new_assignment, existing_assignments):
    fitness = 0
    fitness += FitnessRules.schedule_conflict(new_assignment, existing_assignments)
    fitness += FitnessRules.room_size(new_assignment, existing_assignments)
    fitness += FitnessRules.facilitator_preference(new_assignment, existing_assignments)
    fitness += FitnessRules.facilitator_concurrent_load(new_assignment, existing_assignments)
    fitness += FitnessRules.facilitator_total_load(new_assignment, existing_assignments)
    fitness += FitnessRules.facilitator_consecutive_time_slots(new_assignment, existing_assignments)
    fitness += FitnessRules.activity_specific_adjustments_sla(new_assignment, existing_assignments)
    fitness += FitnessRules.activity_specific_adjustments_sla_191_and_sla_101(new_assignment, existing_assignments)
    fitness += FitnessRules.activity_specific_adjustments_sla_191_and_sla_101_separated_by_1_hour(new_assignment, existing_assignments)
    return fitness

# Creates a random set of assignments
def get_random_assignments():
    assignments = []
    for activity in activities:
        assignment = {
            "activity": activity["name"],
            "enrollment": activity["enrollment"],
            "facilitator": random.choice(activity["preferred_facilitators"]),
            "room": random.choice(list(roomCapacities.keys())),
            "time": random.choice(times)
        }
        assignments.append(assignment)
    return assignments

def get_schedule_fitness(assignments):
    fitness = 0
    for i in range(len(assignments)):
        fitness += get_fitness(assignments[i], assignments[:i])
    return fitness

def get_average_population_fitness(population):
    return sum([get_schedule_fitness(schedule) for schedule in population]) / len(population)

def generation(population, mutation_probability):
    # Cull the least fit half of the population
    population.sort(key=lambda schedule: get_schedule_fitness(schedule), reverse=True)
    culled_population = population[:len(population) // 2]

    # Create the probability distribution
    culled_fitnesses = np.array([[get_schedule_fitness(schedule) for schedule in culled_population]])
    selection_probabilities = softmax(culled_fitnesses)

    # Repopulate the population
    new_population = []
    for i in range(len(culled_population) * 2):
        isMutation = random.random() < mutation_probability
        if isMutation:
            new_population.append(get_random_assignments())
        else:
            [parentA, parentB] = random.choices(
                culled_population,
                weights=selection_probabilities[0],
                cum_weights=None,
                k=2
            )
            split = random.randint(0, len(parentA))
            child = parentA[:split] + parentB[split:]
            new_population.append(child)
    return new_population

def create_initial_population(size):
    population = []
    for i in range(size):
        population.append(get_random_assignments())
    return population

def run_generations(
    initial_population_size,
    min_generations,
    gmin_fitness_improvement_ratio,
    mutation_probability
):
    data = {
        "average_fitness_by_generation": [],
        "ending_schedule": None,
        "ending_fitness": None,
    }
    min_generations = 100
    population = create_initial_population(initial_population_size)
    last_average_fitness = get_average_population_fitness(population)
    data["average_fitness_by_generation"].append(last_average_fitness)
    fitness_improvement = 0
    for i in range(min_generations):
        population = generation(population, mutation_probability)
        average_fitness = get_average_population_fitness(population)
        data["average_fitness_by_generation"].append(average_fitness)
        fitness_improvement = average_fitness - last_average_fitness
        last_average_fitness = average_fitness
    
    fitness_improvement_gmin = fitness_improvement

    print(f'Fitness improvement after minimum generations: {fitness_improvement_gmin}')

    while fitness_improvement > gmin_fitness_improvement_ratio*fitness_improvement_gmin:
        population = generation(population, mutation_probability)
        average_fitness = get_average_population_fitness(population)
        data["average_fitness_by_generation"].append(average_fitness)
        fitness_improvement = average_fitness - last_average_fitness
        last_average_fitness = average_fitness
        print(f"Refining fitness improvement: {fitness_improvement}")
    population.sort(key=lambda schedule: get_schedule_fitness(schedule), reverse=True)
    data["ending_schedule"] = population[0]
    return data


@app.route("/api/genetic-algorithm")
def run_algorithm():
    initial_population_size = request.args.get('initial-population-size', default=500, type=int)
    min_generations = request.args.get('min-generations', default=100, type=int)
    gmin_fitness_improvement_ratio = request.args.get('gmin-fitness-improvement-ratio', default=0.01, type=float)
    mutation_probability = request.args.get('mutation-probability', default=0.05, type=float)
    data = run_generations(
        initial_population_size,
        min_generations,
        gmin_fitness_improvement_ratio,
        mutation_probability
    )


    return json.dumps(data)
